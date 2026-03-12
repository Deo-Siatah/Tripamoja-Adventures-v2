
mock_users = [
    {
        "id": 2,
        "name": "Alice",
        "lat": -1.291,
        "lng": 36.820,
        "destination": "Masai Mara",
        "budget": 750,
        "personality": "adventure",
        "activities": ["safari"]
    },
    {
        "id": 3,
        "name": "Brian",
        "lat": -1.294,
        "lng": 36.822,
        "destination": "Masai Mara",
        "budget": 900,
        "personality": "adventure",
        "activities": ["safari", "photography"]
    },
    {
        "id": 4,
        "name": "Clara",
        "lat": -3.386,
        "lng": 35.563,
        "destination": "Diani Beach",
        "budget": 1200,
        "personality": "relaxation",
        "activities": ["swimming", "sunset"]
    },
    {
        "id": 5,
        "name": "David",
        "lat": -1.295,
        "lng": 36.819,
        "destination": "Masai Mara",
        "budget": 800,
        "personality": "nature",
        "activities": ["safari", "stargazing"]
    },
    # --- New Users Added Below ---
    {
        "id": 6,
        "name": "Grace",
        "lat": -1.288,
        "lng": 36.823,
        "destination": "Masai Mara",
        "budget": 1100,
        "personality": "luxury",
        "activities": ["safari", "sunset"]
    },
    {
        "id": 7,
        "name": "Hassan",
        "lat": -4.032,
        "lng": 39.667,
        "destination": "Diani Beach",
        "budget": 950,
        "personality": "nature",
        "activities": ["swimming", "stargazing"]
    },
    {
        "id": 8,
        "name": "Ibrahim",
        "lat": -1.290,
        "lng": 36.815,
        "destination": "Masai Mara",
        "budget": 700,
        "personality": "adventure",
        "activities": ["hiking", "safari"]
    },
    {
        "id": 9,
        "name": "Moraa",
        "lat": -1.300,
        "lng": 36.780,
        "destination": "Masai Mara",
        "budget": 850,
        "personality": "nature",
        "activities": ["photography", "stargazing"]
    },
    {
        "id": 10,
        "name": "Sauti",
        "lat": -3.390,
        "lng": 35.560,
        "destination": "Diani Beach",
        "budget": 1500,
        "personality": "luxury",
        "activities": ["sunset", "photography"]
    }
]

DESTINATION_BASE_COSTS = {
    "masai mara": 45000, # Estimated cost for 1 person going solo (Transport + Stay)
    "diani beach": 35000,
    "watamu": 30000,
    "amboseli": 40000
}