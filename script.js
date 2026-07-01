// 1. जॉब्स, एडमिट कार्ड और रिज़ल्ट का डेटाबेस (यहाँ आप आसानी से नए जॉब जोड़ सकते हैं)
const jobData = {
    jobs: [
        { 
            title: "CG Vyapam Hostel Warden (छात्रावास अधीक्षक) Online Form 2026", 
            link: "https://vyapam.cgstate.gov.in", 
            date: "01 July 2026", 
            tags: ["CG Vyapam", "12th Pass"] 
        },
        { 
            title: "SSC GD Constable Recruitment Online Form 2026", 
            link: "https://ssc.gov.in", 
            date: "30 June 2026", 
            tags: ["SSC GD", "10th Pass"] 
        },
        { 
            title: "CGPSC State Service Exam (SSE) Notification 2026", 
            link: "https://psc.cg.gov.in", 
            date: "28 June 2026", 
            tags: ["CGPSC", "Graduate"] 
        },
        { 
            title: "CG Police Constable (आरक्षक) Physical Test Schedule 2026", 
            link: "https://cgpolice.gov.in", 
            date: "25 June 2026", 
            tags: ["CG Police", "10th Pass"] 
        },
        { 
            title: "CG Forest Guard (वनरक्षक) Recruitment 2026", 
            link: "https://forest.cg.gov.in", 
            date: "20 June 2026", 
            tags: ["Forest", "12th Pass"] 
        }
    ],
    admits: [
        { 
            title: "SSC GD Constable CBT Exam Admit Card 2026", 
            link: "https://ssc.gov.in", 
            date: "01 July 2026", 
            tags: ["SSC GD"] 
        },
        { 
            title: "CG Vyapam Teacher Eligibility Test (TET) Admit Card 2026", 
            link: "https://vyapam.cgstate.gov.in", 
            date: "27 June 2026", 
            tags: ["CG Vyapam"] 
        },
        { 
            title: "CGPSC Peon (भृत्य) Exam Admit Card 2026", 
            link: "https://psc.cg.gov.in", 
            date: "22 June 2026", 
            tags: ["CGPSC"] 
        }
    ],
    results: [
        { 
            title: "CGPSC State Service Exam (SSE) Mains 2025 Result", 
            link: "https://psc.cg.gov.in", 
            date: "29 June 2026", 
            tags: ["CGPSC"] 
        },
        { 
            title: "CG Vyapam Patwari Recruitment Exam Result 2026", 
            link: "https://vyapam.cgstate.gov.in", 
            date: "24 June 2026", 
            tags: ["CG Vyapam"] 
        },
        { 
            title: "SSC GD Constable Exam 2025 Final Merit List", 
            link: "https://ssc.gov.in", 
            date: "18 June 2026", 
            tags: ["SSC GD"] 
        }
    ]
};

// DOM elements की पहचान
const preloader = document.getElementById('preloader');
const loading = document.getElementById('loading');
const contentGrid = document.getElementById('contentGrid');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');

const jobsList = document.getElementById('jobs-list');
const admitsList = document.getElementById('admits-list');
const resultsList = document.getElementById('results-list');

// 2. डेटा रेंडरिंग और सर्च फ़िल्टर फ़ंक्शन
function displayUpdates(searchText = "") {
    const query = searchText.toLowerCase().trim();

    // फ़िल्टर लॉजिक (शीर्षक या टैग्स दोनों में से किसी से भी सर्च मैच करेगा)
    const matchesFilter = item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(query));
        return titleMatch || tagsMatch;
    };

    const filteredJobs = jobData.jobs.filter(matchesFilter);
    const filteredAdmits = jobData.admits.filter(matchesFilter);
    const filteredResults = jobData.results.filter(matchesFilter);

    // HTML जनरेट करने का सामान्य फ़ंक्शन
    const generateHTML = (list, tagColorClass) => {
        if (list.length === 0) {
            return `<p class="text-gray-400 text-xs py-4 text-center">कोई परिणाम नहीं मिला।</p>`;
        }
        return list.map(item => `
            <div class="job-item p-3 border-b border-gray-100 hover:bg-gray-50 rounded transition duration-200">
                <a href="${item.link}" target="_blank" class="text-blue-600 hover:text-blue-800 font-semibold text-sm block leading-snug">
                    ${item.title}
                </a>
                <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>📅 ${item.date}</span>
                    <span class="${tagColorClass} px-2 py-0.5 rounded font-medium text-[10px] uppercase">
                        ${item.tags[0]}
                    </span>
                </div>
            </div>
        `).join('');
    };

    // तीनों लिस्ट को अपडेट करना
    jobsList.innerHTML = generateHTML(filteredJobs, 'bg-orange-100 text-orange-700');
    admitsList.innerHTML = generateHTML(filteredAdmits, 'bg-blue-100 text-blue-700');
    resultsList.innerHTML = generateHTML(filteredResults, 'bg-green-100 text-green-700');
}

// 3. पेज लोड होने पर प्रीलोडर और लोडिंग हैंडल करना
window.addEventListener('DOMContentLoaded', () => {
    // 1 सेकंड के बाद प्रीलोडर हटेगा और डेटा दिखाई देगा
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
        loading.classList.add('hidden');
        contentGrid.classList.remove('hidden');
        displayUpdates();
    }, 1200);
});

// 4. लाइव सर्च इवेंट लिसनर (रीयल-टाइम सर्च समस्या का हल)
searchInput.addEventListener('input', (e) => {
    displayUpdates(e.target.value);
});

// 5. रीलोड बटन फ़ंक्शनलिटी
refreshBtn.addEventListener('click', () => {
    searchInput.value = ''; // सर्च साफ़ करें
    loading.classList.remove('hidden');
    contentGrid.classList.add('hidden');
    
    setTimeout(() => {
        loading.classList.add('hidden');
        contentGrid.classList.remove('hidden');
        displayUpdates();
    }, 600);
});
