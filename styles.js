body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.container {
    background: white;
    width: 60%;
    margin: 50px auto;
    padding: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

button {
    padding: 12px 18px;
    margin: 10px;
    cursor: pointer;
    border: none;
    font-size: 18px;
    border-radius: 5px;
}

.start-btn { background-color: #4CAF50; color: white; }
.save-btn { background-color: #2196F3; color: white; }
.next-btn { background-color: #FF9800; color: white; }
.submit-btn { background-color: #f44336; color: white; }
.restart-btn { background-color: #795548; color: white; }

#options button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 12px;
    margin: 5px;
    background: #ddd;
    border: 1px solid #bbb;
    font-size: 18px;
}

.selected {
    font-weight: bold;
    background-color: #b3e0ff !important;
}

/* Borders for special messages */
#timeUpMessage {
    font-weight: bold;
    color: navy;
    border: 2px solid red;
    padding: 10px;
    display: inline-block;
}

#feedback {
    font-weight: bold;
    border: 2px solid blue;
    padding: 10px;
    display: inline-block;
}

#result {
    border: 2px solid green;
    padding: 15px;
    margin-top: 20px;
}
