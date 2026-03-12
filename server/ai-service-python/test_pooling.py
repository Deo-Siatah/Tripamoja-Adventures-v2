from pooling import pool_tourists
from data.mock_users import mock_users

user = {
    "id": 101,
    "name": "You",
    "lat": -1.292,
    "lng": 36.821,
    "destination": "Diani Beach",
    "budget": 800,
    "personality": "adventure",
    "activities": ["safari", "photography"]
}

tourists = [user] + mock_users

result = pool_tourists(tourists)

print("\n=== Pooling Result ===\n")
print("Destination:", result["destination"], "\n")

print("Pools:")
for pool_id, members in result["pools"].items():  # ← iterate only over pools
    print(f"Pool {pool_id}:")
    for m in members:
        print(" -", m["name"])

print("\nCompatibility Matches:")
for match in result["compatibility_matches"]:
    print(f"{match['name']} → {match['compatibility']}% match")