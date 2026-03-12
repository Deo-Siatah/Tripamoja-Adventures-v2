# from sklearn.cluster import KMeans
# import numpy as np
# from math import sqrt
# from data.mock_users import mock_users   # ← backend users

personality_map = {
     "adventure": 1,
     "relaxation": 2,
     "nature": 3,
     "luxury": 4
 }

activity_map = {
     "safari": 1,
     "photography": 2,
     "hiking": 3,
     "swimming": 4,
     "sunset": 5,
     "stargazing": 6,
     "waterfalls": 7
 }


def activity_score(activities):
    scores = [activity_map.get(act, 0) for act in activities]
    return sum(scores) / len(scores) if scores else 0


# def create_feature_vector(t):
#      personality = personality_map.get(t["personality"], 0)
#      act_score = activity_score(t["activities"])
#      return [
#          t["lat"],
#          t["lng"],
#          t["budget"] / 1000,
#          personality,
#          act_score
#      ]
def compatibility_score(user_vec, other_vec):
    # user_vec/other_vec structure assumed: [lat, lng, budget, personality_val, activity_count]
    
    # Weights define how important each feature is (must sum to roughly 1 for stability)
    # We divide the raw differences by these "Scale Factors" to normalize them
    scales = [
        0.1,   # Latitude (1 degree is ~111km, so 0.1 is ~11km)
        0.1,   # Longitude
        5000,  # Budget (A 5k difference is now "1 unit" of distance)
        1.0,   # Personality
        2.0    # Activities
    ]
    
    # Calculate weighted squared difference
    # We divide (a-b) by the scale to normalize the "Distance"
    sum_sq = sum(((a - b) / s) ** 2 for a, b, s in zip(user_vec, other_vec, scales))
    distance = sqrt(sum_sq)
    
    # Adjust the multiplier (20 was too aggressive for normalized data)
    # 10 means a total normalized distance of 10 units results in a 0% match
    score = max(0, 100 - distance * 10)
    
    return round(score, 2)

# def pool_tourists(tourists):
#     if not tourists:
#         return {
#             "destination": None,
#             "pools": {},
#             "compatibility_matches": [],
#             "message": "No tourists provided"
#         }

#     destination = tourists[0]["destination"]

#     # Filter tourists for this destination
#     same_destination = [t for t in tourists if t["destination"] == destination]

#     # Always define user_vec from first tourist
#     user = same_destination[0]
#     user_vec = create_feature_vector(user)

#     # Compute compatibility for all others
#     compatibility = []
#     for t in same_destination:
#         if t["id"] == user["id"]:
#             continue
#         vec = create_feature_vector(t)
#         score = compatibility_score(user_vec, vec)
#         compatibility.append({
#             "id": int(t["id"]),
#             "name": t["name"],
#             "compatibility": float(score)
#         })

#     compatibility.sort(key=lambda x: x["compatibility"], reverse=True)

#     # Create pools if enough tourists
#     pools = {}
#     message = None
#     if len(same_destination) >= 2:
#         features = [create_feature_vector(t) for t in same_destination]
#         X = np.array(features)
#         clusters = min(2, len(same_destination))
#         kmeans = KMeans(n_clusters=clusters, random_state=42)
#         labels = kmeans.fit_predict(X)

#         for i, label in enumerate(labels):
#             label = int(label)
#             pools.setdefault(label, []).append({
#                 "id": same_destination[i]["id"],
#                 "name": same_destination[i]["name"]
#             })
#     else:
#         # Only one tourist, cannot form a real pool
#         message = "Not enough tourists for this destination"
#         pools = {0: [{"id": user["id"], "name": user["name"]}]}

#     return {
#         "destination": destination,
#         "pools": pools,
#         "compatibility_matches": compatibility,
#         "message": message
#     }


from sklearn.cluster import KMeans
import numpy as np
from math import sqrt
from data.mock_users import mock_users   # ← backend users

DESTINATION_BASE_COSTS = {
    "masai mara": 45000, 
    "diani beach": 35000,
    "watamu": 30000
}

# ... (Keep personality_map, activity_map, activity_score, create_feature_vector, compatibility_score exactly as they are) ...

def create_feature_vector(user):
    # 1. Get the base cost for the destination
    dest = user['destination'].lower()
    base_cost = DESTINATION_BASE_COSTS.get(dest, 40000)
    
    # 2. Scale the budget (e.g., if budget is 20k and cost is 40k, value is 0.5)
    # This makes budget a small number, similar to Lat/Lng
    scaled_budget = user['budget'] / base_cost
    
    # 3. Scale Lat/Lng (Optional but recommended)
    # Kenya is roughly between Lat -4 to 4 and Lng 34 to 41.
    # Dividing by 10 keeps these in a 0.1 to 0.9 range.
    scaled_lat = user['lat'] / 10
    scaled_lng = user['lng'] / 10

    return [
        scaled_lat,
        scaled_lng,
        scaled_budget,
        personality_map.get(user['personality'], 0) / 5, # Scale 1-5 to 0.2-1.0
        len(user.get('activities', [])) / 10            # Scale to 0.1 per activity
    ]

def pool_tourists(tourists):
    if not tourists:
        return {
            "destination": None,
            "pools": {},
            "compatibility_matches": [],
            "message": "No tourists provided"
        }

    destination = tourists[0]["destination"].lower()
    
    # Get base cost, default to 30000 if destination isn't in our dictionary yet
    base_cost = DESTINATION_BASE_COSTS.get(destination, 30000)

    # Filter tourists for this destination
    same_destination = [t for t in tourists if t["destination"].lower() == destination]

    user = same_destination[0]
    user_vec = create_feature_vector(user)

    # Compute compatibility for all others
    compatibility = []
    for t in same_destination:
        if t["id"] == user["id"]:
            continue
            
        vec = create_feature_vector(t)
        score = compatibility_score(user_vec, vec)
        
        # NEW: Find shared activities to show in the UI (e.g., "You both like Safari")
        shared_acts = list(set(user["activities"]) & set(t["activities"]))
        match_reason = f"Shared interest in {shared_acts[0]}" if shared_acts else "Similar budget & pace"

        compatibility.append({
            "id": int(t["id"]),
            "name": t["name"],
            "compatibility": float(score),
            "personality": t.get("personality", "traveler"),
            "match_reason": match_reason
        })

    compatibility.sort(key=lambda x: x["compatibility"], reverse=True)

    # Create pools if enough tourists
    pools = {}
    message = None
    
    if len(same_destination) >= 2:
        features = [create_feature_vector(t) for t in same_destination]
        X = np.array(features)
        clusters = min(2, len(same_destination))
        kmeans = KMeans(n_clusters=clusters, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X)

        # Temporary dictionary to hold pool members
        temp_pools = {}
        for i, label in enumerate(labels):
            label = int(label)
            temp_pools.setdefault(label, []).append(same_destination[i])

        # NEW: Calculate Financials for each Pool
        for label, members in temp_pools.items():
            pool_size = len(members)
            
            # Simple Pooling Math: 
            # E.g., 2 people = 30% off each, 3 people = 45% off each
            discount_factor = min(0.60, 0.15 * (pool_size - 1)) 
            pooled_cost = int(base_cost * (1 - discount_factor))
            
            # Calculate average budget of this specific pool
            avg_budget = sum(m["budget"] for m in members) / pool_size
            
            # Check if the current user is in this pool
            is_user_in_pool = any(m["id"] == user["id"] for m in members)

            pools[label] = {
                "members": [{"id": m["id"], "name": m["name"], "personality": m["personality"]} for m in members],
                "pool_size": pool_size,
                "original_solo_price": base_cost,
                "new_pooled_price": pooled_cost,
                "estimated_savings": base_cost - pooled_cost,
                "pool_average_budget": round(avg_budget, 0),
                "is_your_ai_recommended_pool": is_user_in_pool
            }
            
    else:
        message = "Not enough tourists for this destination to form a pool yet."
        pools = {
            0: {
                "members": [{"id": user["id"], "name": user["name"], "personality": user["personality"]}],
                "pool_size": 1,
                "original_solo_price": base_cost,
                "new_pooled_price": base_cost,
                "estimated_savings": 0,
                "is_your_ai_recommended_pool": True
            }
        }

    return {
        "destination": destination.title(),
        "base_solo_cost": base_cost,
        "pools": pools,
        "compatibility_matches": compatibility,
        "message": message
    }