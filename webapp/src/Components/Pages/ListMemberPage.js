/**
 * Render the ListMemberPage
 */

const ListMemberPage = async () => {
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = "";
  viewRegisteredMembers();
  viewDeniedMembers();
};

async function viewRegisteredMembers() {
  const pageDiv = document.querySelector("#page");
  try {
    //Membres en attente d'acceptation
    const response = await fetch("/api/members/list_registered");
    if (!response.ok) {
      // status code was not 200, error status code
      throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
      );
    }
    const members = await response.json();

    //Create Div and Table
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive pt-5";
    tableWrapper.innerHTML = "Membres en attente d'acceptation";
    const table = document.createElement("table");
    table.className = "table table";
    tableWrapper.appendChild(table);

    //Create the header of the table
    const thead = document.createElement("thead");
    const header = document.createElement("tr");
    thead.appendChild(header);
    const header1 = document.createElement("th");
    header1.innerText = "Nom";
    const header2 = document.createElement("th");
    header2.innerText = "Prénom";
    header.appendChild(header1);
    header.appendChild(header2);
    table.appendChild(thead);

    // Create the body of the table
    const tbody = document.createElement("tbody");
    members.forEach((member) => {
      const line = document.createElement("tr");
      const NameCell = document.createElement("td");
      NameCell.innerText = member.lastName;
      line.appendChild(NameCell);
      const firstNameCell = document.createElement("td");
      firstNameCell.innerText = member.firstName;
      line.appendChild(firstNameCell);
      line.dataset.memberId = member.id;
      tbody.appendChild(line);
    });
    table.appendChild(tbody);
    // add the HTMLTableElement to the main, within the #page div
    pageDiv.appendChild(tableWrapper);
  } catch (error) {
    console.error("ListMemberPage::error: ", error);
  }
}

async function viewDeniedMembers() {
  const pageDiv = document.querySelector("#page");
  try {
    //Membres en attente d'acceptation
    const response = await fetch("/api/members/list_denied");
    if (!response.ok) {
      // status code was not 200, error status code
      throw new Error(
          "fetch error : " + response.status + " : " + response.statusText
      );
    }
    const members = await response.json();

    //Create Div and Table
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive pt-5";
    tableWrapper.innerHTML = "Membres refusés";
    const table = document.createElement("table");
    table.className = "table table";
    tableWrapper.appendChild(table);

    //Create the header of the table
    const thead = document.createElement("thead");
    const header = document.createElement("tr");
    thead.appendChild(header);
    const header1 = document.createElement("th");
    header1.innerText = "Nom";
    const header2 = document.createElement("th");
    header2.innerText = "Prénom";
    header.appendChild(header1);
    header.appendChild(header2);
    table.appendChild(thead);

    // Create the body of the table
    const tbody = document.createElement("tbody");
    members.forEach((member) => {
      const line = document.createElement("tr");
      const NameCell = document.createElement("td");
      NameCell.innerText = member.lastName;
      line.appendChild(NameCell);
      const firstNameCell = document.createElement("td");
      firstNameCell.innerText = member.firstName;
      line.appendChild(firstNameCell);
      line.dataset.memberId = member.id;
      tbody.appendChild(line);
    });
    table.appendChild(tbody);
    // add the HTMLTableElement to the main, within the #page div
    pageDiv.appendChild(tableWrapper);
  } catch (error) {
    console.error("ListMemberPage::error: ", error);
  }
}

export default ListMemberPage;