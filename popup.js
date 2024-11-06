document.getElementById('myButton').addEventListener('click', () => {
    sendFeedbackType("myButton");
});
  
function sendFeedbackType(type) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: fillFeedback,
        args: [type]
        })
    })
}
  
function fillFeedback(type) {
    const iframeDocument = document.getElementById('myframe').contentDocument || 
                           document.getElementById('myframe').contentWindow.document

    courses = iframeDocument.querySelectorAll("tr")

    courses.forEach( async(course) => {
        if ( course.querySelectorAll("th").length === 7 ) return

        const courseCode = course.querySelectorAll("td")[0].textContent.trim()
        const response = await fetch(`https://erp.iitj.ac.in/Academic/getIHSubCount.htm?subno=${courseCode}`)
        let numberOfStudents = await response.json()
        numberOfStudents = numberOfStudents.count

        const subjectCell = course.querySelectorAll("td")[1];
        const subject = subjectCell.textContent.trim();
        
        // Create a span element to wrap the number of students
        const studentSpan = document.createElement('span');
        studentSpan.textContent = ` Count : ${numberOfStudents}`;
        
        studentSpan.style.fontWeight = 'bold';
        studentSpan.style.color = '#45a049';
        studentSpan.style.fontSize = '1em';
        
        subjectCell.textContent = subject;
        subjectCell.appendChild(studentSpan);
        return
    })  
}
  