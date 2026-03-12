from vector_search import search

query = "weekend getaway"

results = search(query)

print("\nSearch Results:\n")

for r in results:
    print("-", r)