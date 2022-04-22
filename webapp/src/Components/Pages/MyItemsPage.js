import {
  cancelOffer as cancelOfferBackEnd,
  chooseRecipient as chooseRecpientBackEnd,
  getInterestedMembers,
  getMyItems,
  markItemAs as markItemAsaBackEnd,
  offerAgain as offerAgainBackEnd
} from "../../utils/BackEndRequests";
import {getPayload} from "../../utils/session";
import {showError} from "../../utils/ShowError";
import {openModal} from "../../utils/Modals";
import {Redirect} from "../Router/Router";

const myItemsPageHtml = `
  <div>
    <h1 class="display-3">Mes offres</h1>
    <br>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Titre</th>
          <th scope="col">Description de l'objet</th>
          <th scope="col">Photo</th>
          <th scope="col">Statut de l'offre</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="tbody_my_items">
      </tbody>
    </table>
  </div>
  <div id="errorMessageMyItemsPage"></div>
  
  <!-- The Modal offer again -->
<div id="myItemsPageModal" class="modal">
  <div class="modal-content">
    <span id="myItemsPageModalCloseButton" class="close">&times;</span>
    <form id="offerAgainForm">
      <h5>Pour offrir un objet à nouveau, il faut que vous entrez une nouvelle plage horaire</h5><br>
      <br>
      Disponibilités horaire<span id="asterisk">*</span>:<br>
      <textarea id="timeSlotFormOfferAgain" cols="30" rows="3"></textarea><br>
      <br>
      <input type="submit" value="Envoyer">
    </form>
  </div>
</div>

<!--Modal for choose recipient-->
<div id="chooseRecipientModal" class="modal">
  <div class="modal-content">
    <span id="chooseRecipientModalCloseButton" class="close">&times;</span>
    <form id="offerAgainForm">
      <h5>Sélectionnez un membre dans la liste des membres intéressés</h5><br>
      <br>
      Liste de membre<span id="asterisk">*</span>:<br>
      <input id="chooseRecipientMemberListForm" list="chooseRecipientMembersList" placeholder="Choisissez un membre.">
      <datalist id="chooseRecipientMembersList"></datalist><br>
      <br>
      <input type="submit" value="Envoyer">
    </form>
  </div>
</div>
`;

let idItem;

const MyItemsPage = async () => {
  if (!getPayload()) {
    Redirect("/");
    return;
  }
  const pageDiv = document.querySelector("#page");
  pageDiv.innerHTML = myItemsPageHtml;
  const items = await getMyItems();
  if (items.length === 0) {
    const message = "Vous n'avez aucune offre.";
    const errorMessageMyItemsPage = document.querySelector(
        "#errorMessageMyItemsPage");
    showError(message, "info", errorMessageMyItemsPage);
  } else {
    showItems(items);
  }
};

function showItems(items) {
  const tbody = document.querySelector("#tbody_my_items");
  console.table(items)
  tbody.innerHTML = "";
  items.forEach((item) => {
    const cancelButtonHtml = `<td><button id="itemCancelled" class="btn btn-danger" value="${item.id}">Annuler l'offre</button></td>`;
    const offerAgainButtonHtml = `<td><button id="offerAgainButton" class="btn btn-primary" value="${item.id}">Offrir à nouveau</button></td>`;
    const markReceivedButtonHtml = `<td><button id="markReceivedButton" class="btn btn-primary" value="${item.id}">Objet donné</button></td>`;
    const chooseRecipientButtonHtml = `<td><button id="chooseRecipientButton" class="btn btn-primary" value="${item.id}">Choisir un receveur</button></td>`;
    const markNotGivenButtonHtml = `<td><button id="markNotGivenButton" class="btn btn-primary" value="${item.id}">Objet non récupéré</button></td>`;
    let html = `
      <tr>
        <td>${item.title}</td>
        <td>${item.itemDescription}</td>
        <td>${item.photo}</td>
        <td>${item.offerStatus}</td>
        <td><a id="itemDetails" href="/item?id=${item.id}" type="button" class="btn btn-primary">Voir offre</a></td>
    `;
    if (item.offerStatus === "donated") {
      html += `
        ${offerAgainButtonHtml}
        ${chooseRecipientButtonHtml}
        ${cancelButtonHtml}
      `;
    } else if (item.offerStatus === "cancelled") {
      html += `
        ${offerAgainButtonHtml}  
      `;
    } else if (item.offerStatus === "assigned") {
      html += `
        ${markReceivedButtonHtml}
        ${markNotGivenButtonHtml}
        ${cancelButtonHtml}
      `;
    }
    html += "</tr>";
    tbody.innerHTML += html
  });

  /*************/
  /*Offer again*/
  /*************/
  const offerAgainButtons = document.querySelectorAll("#offerAgainButton");
  offerAgainButtons.forEach(async (offerAgainButton) => {
    offerAgainButton.addEventListener("click", async () => {
      idItem = offerAgainButton.value;
      openModal("#myItemsPageModal", "#myItemsPageModalCloseButton");
      const offerAgainForm = document.querySelector("#offerAgainForm");
      offerAgainForm.addEventListener("submit", await offerAgain);
    })
  });

  /*********************************/
  /*Choose a recipient for the item*/
  /*********************************/
  const chooseRecipientButtons = document.querySelectorAll(
      "#chooseRecipientButton");
  chooseRecipientButtons.forEach(async (chooseRecipientButton) => {
    chooseRecipientButton.addEventListener("click", async () => {
      idItem = chooseRecipientButton.value;
      const item = items.find((item) => item.id == idItem);
      const members = await getInterestedMembers(item.offerList[0].id);
      if (!members) {
        const errorDiv = document.querySelector("#errorMessageMyItemsPage");
        showError("Aucun membre n'est intéressé par votre offre pour l'instant",
            "danger", errorDiv);
        return;
      }
      openModal("#chooseRecipientModal", "#chooseRecipientModalCloseButton");
      const memberList = document.querySelector(
          "#chooseRecipientMembersList");
      memberList.innerHTML = ""; //empties the datalist of old members
      members.forEach((member) => {
        memberList.innerHTML += `
          <option value="${member.username}">
        `;
      });
      const chooseRecipientModal = document.querySelector(
          "#chooseRecipientModal");
      chooseRecipientModal.addEventListener("submit", await chooseRecipient);
    });
  });

  /********************/
  /*Mark item as given*/
  /********************/
  const markReceivedButtons = document.querySelectorAll("#markReceivedButton");
  markReceivedButtons.forEach((markReceivedButton) => {
    markReceivedButton.addEventListener("click", async () => {
      idItem = markReceivedButton.value;
      await markItemAs(true);
    });
  });

  /***************************/
  /*Mark item as not received*/
  /***************************/
  const markNotGivenButtons = document.querySelectorAll("#markNotGivenButton");
  markNotGivenButtons.forEach((markNotGivenButton) => {
    markNotGivenButton.addEventListener("click", async () => {
      idItem = markNotGivenButton.value;
      await markItemAs(false);
    });
  });

  /*****************/
  /*Cancel an offer*/
  /*****************/
  const cancelButtons = document.querySelectorAll("#itemCancelled");
  cancelButtons.forEach(cancelButton => {
    cancelButton.addEventListener("click", async () => {
      await cancelOfferBackEnd(cancelButton.value);
      await MyItemsPage()
    });
  });
}

async function offerAgain(e) {
  e.preventDefault();
  const timeSlot = document.querySelector("#timeSlotFormOfferAgain").value;
  const offer = {
    idItem: idItem,
    timeSlot: timeSlot
  }
  try {
    await offerAgainBackEnd(offer);
    await MyItemsPage();
  } catch (e) {
    console.error(e);
  }
}

async function chooseRecipient(e) {
  e.preventDefault();
  const errorDiv = document.querySelector("#errorMessageMyItemsPage");
  showError("Sélection du receveur en cours...", "info", errorDiv);
  const recipientUsername = document.querySelector(
      "#chooseRecipientMemberListForm").value;
  const recipient = {
    item: {
      id: idItem
    },
    member: {
      username: recipientUsername
    }
  }
  try {
    await chooseRecpientBackEnd(recipient)
    showError("Vous avez choisi l'utilisateur " + recipientUsername
        + " comme receveur.", "success", errorDiv);
    await MyItemsPage();
  } catch (e) {
    showError("Impossible de choisir le receveur.", "danger", errorDiv);
  }
}

async function markItemAs(given) {
  const errorDiv = document.querySelector("#errorMessageMyItemsPage");
  showError("Le changement est en cours...", "info", errorDiv);
  const item = {
    id: idItem,
    member: {
      id: getPayload().id
    }
  }
  try {
    await markItemAsaBackEnd(given, item);
    showError("L'objet à bien été marqué comme donné.", "success", errorDiv);
    await MyItemsPage();
  } catch (e) {
    showError("L'objet n'a pas été marqué comme donné.", "danger", errorDiv);
  }
}

export default MyItemsPage;