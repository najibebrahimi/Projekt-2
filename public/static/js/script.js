const PORTFOLIO_BACKEND_API = "http://localhost:5023/api";

async function apiRequest(endpoint, method = "GET", body = null, headers = {}) {
    const url = `${PORTFOLIO_BACKEND_API}${endpoint}`;
    const defaultHeaders = { "Content-Type": "application/json" };
  
    try {
      const response = await fetch(url, {
        method : method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : null,
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
  
      return null;
  
    } catch (error) {
      /*console.error(`API request error: ${error.message}`);*/
      throw error; // Re-throw to allow further handling if needed
    }
}

async function contact(fullname, emailAddress, message) {
    console.log(fullname, emailAddress, message);
    return apiRequest("/forms/contact", 
        "POST", 
        {
            name: fullname,
            email: emailAddress,
            message: message,
        }
    );
}

async function getProjects() {
    return apiRequest("/project");
}

async function getProject(id) {
    return apiRequest(`/project/${id}`);
}

function renderProjects(projects) {
    const $gridContainer = $("#projects-grid");
    $gridContainer.empty();

    projects.forEach(project => {
        const $projectElement = $(
            `<div class="project-card">
                <a href="${project.versionControlUrl}"<h3>${project.name}</h3></a>
                <p>${project.description}</p>
            </div>`
        );
        $gridContainer.append($projectElement);
    });
}

$(document).ready(function() {
    getProjects()
        .then((data) => {
            renderProjects(data);
        })
        .catch((error) => {
            console.error("Failed to load projects:", error);
    });

    $('#contact-form').on('submit', async function (e) {
        e.preventDefault(); 

        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val(),
        };

        try {
            await contact(formData.name, formData.email, formData.message);
        } catch (error) {
            console.error(error);
        }
    });

    $("#download-cv").on('click', async (event) => {
        event.preventDefault();
        const cvUrl = '/static/assets/cv.pdf'; // URL of the CV file

        try {
            const response = await fetch(cvUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch the CV: ${response.statusText}`);
            }

            const blob = await response.blob();

            // Create a temporary download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'My_CV.pdf'; // Set the default file name
            document.body.appendChild(a);
            a.click(); // Trigger the download
            document.body.removeChild(a);

            // Revoke the object URL to free up memory
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading CV:', error.message);
        }
    });
});
