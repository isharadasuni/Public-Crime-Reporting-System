import pickle
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from flask_cors import CORS

# Initialize Flask application
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

model = None

# Load the saved model
model_path = 'sentence_transformer_model.pkl'
try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"Model loaded successfully from '{model_path}'")
except FileNotFoundError:
    print(f"Error: Model file '{model_path}' not found.")
    exit(1)
except Exception as e:
    print(f"Error loading model from '{model_path}': {e}")
    exit(1)

# Prediction route  API Endpoint for Duplicate Text Detection
@app.route('/duplicate', methods=['POST'])
def predict():
    try:
        if model is None:
            print("Model not loaded")
            return jsonify({'error': 'Model not loaded'})

        # Get JSON data from the request
        data = request.get_json(force=True)
        main_text = data['main_text']
        additional_texts = data['additional_texts']
        similarity_threshold = data.get('similarity_threshold', 0.3)  

        # Encode main_text and additional_texts using SentenceTransformer
        main_text_embedding = model.encode([main_text])[0]
        additional_text_embeddings = model.encode(additional_texts)

        # Calculate cosine similarity between main_text and additional_texts
        similarities = util.pytorch_cos_sim(main_text_embedding.reshape(1, -1), additional_text_embeddings)[0]

        # Filter out texts below the similarity threshold
        similar_texts = [{
            "text": additional_texts[i],
            "similarity": similarities[i].item()
        } for i in range(len(additional_texts)) if similarities[i] > similarity_threshold]

        # Sort similar_texts by similarity score (descending)
        similar_texts = sorted(similar_texts, key=lambda x: x['similarity'], reverse=True)

        return jsonify(similar_texts)
    
    except KeyError as e:
        return jsonify({'error': f'Missing key in JSON request: {str(e)}'})
    except Exception as e:
        return jsonify({'error': str(e)})

# Runing the flask application on port 8000
if __name__ == '__main__':
    app.run(debug=True, port=8000)
