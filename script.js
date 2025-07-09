
  const bgTemplates = [
    { label: "Mountain Adventure (hiking.png)", file: "hiking.png" },
    { label: "Bookkeeping Award (bookkeeping.png)", file: "bookkeeping.png" }
  ];

  function populateBackgroundSelector() {
    const selector = document.getElementById("bgSelector");
    bgTemplates.forEach(template => {
      const option = document.createElement("option");
      option.value = template.file;
      option.textContent = template.label;
      selector.appendChild(option);
    });
  }

  function changeBackground() {
    const selected = document.getElementById("bgSelector").value;
    const preview = document.getElementById("certificatePreview");
    preview.style.backgroundImage = `url('./cert_template/${selected}')`;
  }

  function updateCertificate() {
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    const leadersDiv = document.getElementById("certLeaders");

    document.getElementById("certName").innerText = name;
    document.getElementById("certMessage").innerText = message;

    leadersDiv.innerHTML = "";

    const leaderEntries = document.querySelectorAll(".leader-entry");
    leaderEntries.forEach(entry => {
      const name = entry.querySelector(".leader-name").value.trim();
      const title = entry.querySelector(".leader-title").value.trim();
      if (name && title) {
        const div = document.createElement("div");
        div.className = "leader";
        div.innerHTML = `
          <span><strong>${name.toUpperCase()}</strong></span>
          <span>${title.toUpperCase()}</span>
        `;
        leadersDiv.appendChild(div);
      }
    });
  }

  function addLeader() {
    const container = document.getElementById("leadersContainer");
    const div = document.createElement("div");
    div.className = "leader-entry";
    div.innerHTML = `
      <input type="text" class="leader-name" placeholder="Name (e.g. Jane Doe)">
      <input type="text" class="leader-title" placeholder="Title (e.g. Teacher, Leader)">
    `;
    container.appendChild(div);
  }

  async function downloadAllPDFs() {
    const namesRaw = document.getElementById("names").value.trim();
    const message = document.getElementById("message").value;
    const certificate = document.getElementById("certificatePreview");
    const nameField = document.getElementById("certName");
    const messageField = document.getElementById("certMessage");
    const leadersField = document.getElementById("certLeaders");

    const leaderEntries = document.querySelectorAll(".leader-entry");
    const names = namesRaw.split("\n").map(n => n.trim()).filter(n => n.length > 0);

    for (const name of names) {
      nameField.innerText = name;
      messageField.innerText = message;

      leadersField.innerHTML = "";
      leaderEntries.forEach(entry => {
        const lname = entry.querySelector(".leader-name").value.trim();
        const ltitle = entry.querySelector(".leader-title").value.trim();
        if (lname && ltitle) {
          const div = document.createElement("div");
          div.className = "leader";
          div.innerHTML = `
            <span><strong>${lname.toUpperCase()}</strong></span>
            <span>${ltitle.toUpperCase()}</span>
          `;
          leadersField.appendChild(div);
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificate, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jspdf.jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 297;
      const pageHeight = 210;
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

      const filename = name.replace(/\s+/g, "_") + "_certificate.pdf";
      pdf.save(filename);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    alert("All certificates downloaded!");
  }

  async function downloadCertificatePDF() {
    const certificate = document.getElementById("certificatePreview");

    const canvas = await html2canvas(certificate, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

    const name = document.getElementById("name").value.trim() || "certificate";
    const filename = name.replace(/\s+/g, "_") + "_certificate.pdf";
    pdf.save(filename);
  }

  window.onload = function () {
    populateBackgroundSelector();
    changeBackground();
  };
