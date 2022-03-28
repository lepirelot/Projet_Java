import {getItemsTypes, offerAnItem} from "../../utils/BackEndRequests";
import {showError} from "../../utils/ShowError";
import {getPayload} from "../../utils/session";

const htmlForm = `
  <div>
    <h1 class="display-3">Offrir un objet</h1>
    <form id="offerItemForm">
      Nom de l'objet<span id="asterisk">*</span>: <br>
      <textarea id="titleForm" cols="30" rows="3"></textarea><br>
      <br>
      Description de l'objet<span id="asterisk">*</span>:<br>
      <textarea id="itemDescriptionForm" cols="30" rows="3"></textarea><br>
      <br>
      Image:<br>
      <input id="photoForm" type="image"><br>
      <br>
      Disponibilités horaire<span id="asterisk">*</span>:<br>
      <textarea id="timeSlotForm" cols="30" rows="3"></textarea><br>
      <br>
      Type de l'objet<span id="asterisk">*</span>:<br>
      <input id="itemTypeFormList" list="itemsTypes" placeholder="Séléctionne le type d'objet"><br>
      <datalist id="itemsTypes"></datalist>
      <br>
      <input type="submit" value="Offrir">
    </form>
  </div>
  <div id="errorMessageOfferAnItemPage"></div>
`;

const OfferAnItemPage = async () => {
  const page = document.querySelector("#page");
  page.innerHTML = htmlForm;
  const offerItemForm = document.querySelector("#offerItemForm");
  await showItemsTypes();
  offerItemForm.addEventListener("submit", await offerItem);
};

async function showItemsTypes() {
  const itemsTypes = await getItemsTypes();
  const itemsTypeList = document.querySelector("#itemsTypes")
  itemsTypes.forEach(itemsType => {
    itemsTypeList.innerHTML += `
      <option value="${itemsType.itemType}">
    `;
  });
}

async function offerItem(e) {
  e.preventDefault();
  const title = document.querySelector("#titleForm").value;
  const itemDescription = document.querySelector("#itemDescriptionForm").value;
  const photo = document.querySelector("#photoForm").value;
  const timeSlot = document.querySelector("#timeSlotForm").value;
  const itemTypeValue = document.querySelector("#itemTypeFormList").value;
  const payload = await getPayload();
  const offer = {
    timeSlot: timeSlot
  };
  const offersList = [offer];
  const member = {
    id: payload.id
  };
  const itemType = {
    itemType: itemTypeValue
  };
  const item = {
    itemDescription: itemDescription,
    title: title,
    photo: photo,
    itemType: itemType,
    member: member,
    offerList: offersList
  }
  try {
    await offerAnItem(item);
    const errorMessageOfferAnItemPage = document.querySelector(
        "#errorMessageOfferAnItemPage");
    const message = "Ajout réussi!"
    showError(message, "success", errorMessageOfferAnItemPage);
  } catch (error) {
    console.error(error);
  }
}

export {OfferAnItemPage};