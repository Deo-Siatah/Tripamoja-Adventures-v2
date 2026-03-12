#from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

documents = [

Document(
    page_content="Masai Mara National Reserve famous for wildebeest migration and safari adventure",
    metadata={
        "name": "Masai Mara Safari",
        "type": "wildlife",
        "mood": ["adventure","wildlife","exploration"],
        "activities": ["safari","photography"],
        "location": "Narok",
        "price_range": "high"
    }
),

Document(
    page_content="Diani Beach known for white sand beaches romantic sunsets and ocean breeze",
    metadata={
        "name": "Diani Beach Escape",
        "type": "beach",
        "mood": ["romantic","relaxing","luxury"],
        "activities": ["swimming","sunset viewing"],
        "location": "Kwale",
        "price_range": "medium"
    }
),

Document(
    page_content="Mount Kenya National Park ideal for hiking adventure and mountain climbing",
    metadata={
        "name": "Mount Kenya Trek",
        "type": "mountain",
        "mood": ["adventure","challenge","exploration"],
        "activities": ["hiking","climbing"],
        "location": "Central Kenya",
        "price_range": "medium"
    }
),

Document(
    page_content="Nairobi National Park wildlife safari close to the city skyline",
    metadata={
        "name": "Nairobi Safari",
        "type": "wildlife",
        "mood": ["wildlife","short adventure"],
        "activities": ["safari"],
        "location": "Nairobi",
        "price_range": "low"
    }
),

Document(
    page_content="Aberdare ranges peaceful mountain forests waterfalls and quiet nature",
    metadata={
        "name": "Aberdare Nature Retreat",
        "type": "mountain",
        "mood": ["peaceful","lonely","nature","reflection"],
        "activities": ["hiking","waterfalls"],
        "location": "Nyeri",
        "price_range": "medium"
    }
)

]

db = FAISS.from_documents(documents, embeddings)

def search(query):

    results = db.similarity_search(query, k=3)

    response = []

    for r in results:
        response.append({
            "description": r.page_content,
            "metadata": r.metadata
        })

    return response

#Response

# {
# "results":[
# "Mount Kenya National Park popular for hiking",
# "Nairobi National Park wildlife near city"
# ]
# }