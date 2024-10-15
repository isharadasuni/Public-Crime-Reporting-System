import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS





# Load the model
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Dictionary to map numeric prediction values to string values
prediction_mapping = {5: 'Robbery', 0: 'Assault', 3: 'Drug-related offenses', 
4: 'Fraud and financial crimes', 2: 'Domestic violence', 1: 'Cybercrimes', 
7: 'Vandalism', 6: 'Sexual offenses'}

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route("/ping", methods=["GET"])
def ping():
    return "Hello, I am alive"

@app.route('/predict', methods=['POST'])
def predict():

    global model
    global prediction_mapping
    try:
        # Get the JSON data from the request
        data = request.json  
        
        # Ensure 'text' key is present in the JSON data
        if 'text' not in data:
            return jsonify({'error': 'Invalid input. Key "text" missing in request JSON.'}), 400

        
        # Get the 'text' value from the JSON data
        text = data['text']  
        
        # Ensure text is a string
        if not isinstance(text, str):
            return jsonify({'error': 'Invalid input. Text must be a string.'}), 400

        # Make prediction using the loaded model
        prediction = model.predict([text])[0]
        
        # Map numeric prediction value to string value using the prediction_mapping dictionary
        prediction_string = prediction_mapping.get(prediction, 'Unknown')

        # Return the prediction as JSON 
        return jsonify({'prediction': prediction_string})
  
    except Exception as e:
        # Handle errors gracefully
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
