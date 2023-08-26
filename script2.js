

function pastData() {
    fetch('jvayeni_hs.php') // Use the correct path to your PHP script
    .then(response => response.json())
    .then(data => {
        // Process the JSON data and display it in your HTML
        const dataTable= document.querySelector(".pastHis");

        data.forEach(item => {
            const tableRow = document.createElement("tr");
            tableRow.innerHTML = `
                <td>${item.city}</td>
                <td>${item.date}</td>
                <td>${item.temperature}°C</td>
                <td>${item.humidity}%</td>
                <td>${item.pressure} Pa</td>
                <td>${item.wind} m/s</td>
                <td>${item.description}</td>
            `;
            dataTable.appendChild(tableRow);
        });
        
    })
    .catch(error => {
        console.error('Occured some error >', error);
    });
}

// Call the function to fetch and display the data
pastData();