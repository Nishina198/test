async function searchGoogle() {
    const query = document.getElementById("searchQuery").value;
    if (!query) {
        alert("Zadejte vyhledávací dotaz!");
        return;
    }

    try {
        console.log(`Відправляємо запит: ${query}`);
        const response = await fetch("http://localhost:3000/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("results").textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error("Error:", error);
    }
}
function downloadResultsAsJSON() {
    const resultsContainer = document.getElementById("results");
    const resultsText = resultsContainer.innerText.trim();
    const results = { content: resultsText };
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'search-results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

