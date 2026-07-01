// Website load hone par loading screen (Preloader) ko hide karna
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // 0.5 second ka fade-out effect
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const jobsList = document.getElementById('jobs-list');
    const admitsList = document.getElementById('admits-list');
    const resultsList = document.getElementById('results-list');
    const loadingDiv = document.getElementById('loading');
    const contentGrid = document.getElementById('contentGrid');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');

    // Free RSS to JSON Converter API Link
    const rssFeedUrl = "https://www.freejobalert.com/feed/";
    const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

    // Offline Demo data agar API fail ho jaye
    const demoData = [
        { title: "CGPSC State Service Exam Recruitment 2026", link: "#", category: "Job", org: "CGPSC" },
        { title: "CG Vyapam Deputy Auditor Job Notification", link: "#", category: "Job", org: "CG Vyapam" },
        { title: "CG Vyapam Teacher Admit Card Out", link: "#", category: "Admit Card", org: "CG Vyapam" },
        { title: "CGPSC Prelims Result Declared 2026", link: "#", category: "Result", org: "CGPSC" }
    ];

    function fetchJobs() {
        loadingDiv.style.display = 'block';
        contentGrid.style.display = 'none';
        
        // Lists ko saaf (empty) karna
        jobsList.innerHTML = '';
        admitsList.innerHTML = '';
        resultsList.innerHTML = '';

        fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items.length > 0) {
                    processJobs(data.items);
                } else {
                    processJobs(demoData); // Fallback to demo data
                }
            })
            .catch(error => {
                console.log("Error fetching jobs, loading demo data instead.", error);
                processJobs(demoData); // Fallback to demo data
            })
            .finally(() => {
                loadingDiv.style.display = 'none';
                contentGrid.style.display = 'grid'; // Grid ko wapas dikhana
            });
    }

    function processJobs(items) {
        items.forEach(item => {
            const title = item.title;
            const link = item.link;
            const title_lower = title.toLowerCase();

            // Category check karna
            let category = item.category || 'Job';
            if (title_lower.includes('admit card')) {
                category = 'Admit Card';
            } else if (title_lower.includes('result')) {
                category = 'Result';
            }

            // Organization check karna
            let organization = item.org || 'CG Govt';
            if (title_lower.includes('cg') || title_lower.includes('chhattisgarh')) {
                organization = 'CG State';
            } else if (title_lower.includes('psc')) {
                organization = 'CGPSC';
            } else if (title_lower.includes('vyapam')) {
                organization = 'CG Vyapam';
            }

            // HTML Element Card banana
            const jobCard = document.createElement('div');
            jobCard.className = 'job-item border-b pb-3 p-1 rounded transition-all';
            
            // Badge color set karna
            let badgeClass = 'bg-orange-100 text-orange-800';
            if (category === 'Admit Card') badgeClass = 'bg-blue-100 text-blue-800';
            if (category === 'Result') badgeClass = 'bg-green-100 text-green-800';

            jobCard.innerHTML = `
                <span class="text-[10px] font-semibold ${badgeClass} px-2 py-0.5 rounded">${organization}</span>
                <a href="${link}" target="_blank" class="job-title block text-blue-600 hover:underline font-medium mt-1 text-sm">${title}</a>
            `;

            // Shi column me insert karna
            if (category === 'Job') {
                jobsList.appendChild(jobCard);
            } else if (category === 'Admit Card') {
                admitsList.appendChild(jobCard);
            } else if (category === 'Result') {
                resultsList.appendChild(jobCard);
            }
        });
    }

    // Live Search Logic
    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.job-item');

        cards.forEach(card => {
            const text = card.querySelector('.job-title').textContent.toLowerCase();
            if (text.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Refresh click action
    refreshBtn.addEventListener('click', fetchJobs);

    // Pehli baar me page loading ke sath run karna
    fetchJobs();
});