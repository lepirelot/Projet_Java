import {getPayload,} from "../../utils/session";
import {Redirect} from "../Router/Router";
import {showError} from "../../utils/ShowError";
import {
  getItem,
  postInterest as postInterestBackEnd
} from "../../utils/BackEndRequests";

const viewOfferHtml = `
<div id="offerCard" class="card mb-3">
  <div class="row no-gutters">
  <div class="col-md">
      <div class="card-body">
        <h2 id="title" class="card-title"></h2>
        <p id="offerer" class="text-muted"> </p>
        <h5 id="type" class="card-text"></h5>
        <h5 id="description" class="card-text"></h5>
        <h5 id="availabilities" class="card-text"></h5>
        <h5 id="pubDate" class="card-text"></h5>

        <form>
                <div class="form-check form-switch">
         <input class="form-check-input" type="checkbox" id="callWanted">
         <label class="form-check-label" for="callWanted">J'accepte d'être appelé</label>
        </div>
           <input id="interestButton" type="submit" class="btn btn-primary" value="Je suis interessé(e) !">
       </form>

       <div class="message" id="interestMessage"></div>
      </div>
    </div>
    <div class="col-md-4">
      <img src="" class="card-img" alt="JS">
    </div>
  </div>
</div>
`;

let idItem;

/**
 * Render the OfferPage :
 */
async function ViewItemPage() {
  if (!getPayload()) {
    Redirect("/");
    return;
  }
  //get param from url
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const page = document.querySelector("#page");
  idItem = urlParams.get("id");
  page.innerHTML = viewOfferHtml;
  const button = document.querySelector("#offerCard");
  //get offer's infos with the id in param
  await getItemInfo(idItem);
  //post an interest
  button.addEventListener("submit", postInterest);
}

async function getItemInfo(idItem) {
  try {
    const item = await getItem(idItem);
    const lastOffer = item.offerList[0];
    var date = new Date(lastOffer.date);
    date = date.getDate() + "/" + (date.getMonth() + 1) + "/"
        + date.getFullYear();

    document.querySelector("#title").innerHTML = item.title
    document.querySelector(
        "#offerer").innerHTML = `Offre proposée par : ${item.member.firstName} ${item.member.lastName} `
    document.querySelector(
        "#type").innerHTML = `Type : ${item.itemType.itemType}`
    document.querySelector(
        "#description").innerHTML = `Description : ${item.itemDescription}`
    document.querySelector(
        "#availabilities").innerHTML = `Disponibilités : ${lastOffer.timeSlot}`
    document.querySelector(
        "#pubDate").innerHTML = `Date de publication : ${date}`
  } catch (err) {
    console.error(err);
  }
}

async function postInterest(e) {
  console.log("postInterest");
  e.preventDefault();
  const interestMessage = document.querySelector("#interestMessage");
  //const urlParams = new URLSearchParams(queryString);
  const callWanted = document.querySelector("#callWanted").checked;
  const member = {
    id: getPayload().id
  };
  const interest = {
    callWanted: callWanted,
    idItem: idItem,
    member: member
  };
  console.table(interest);
  try {
    await postInterestBackEnd(interest, interestMessage);
  } catch (err) {
    showError("Votre marque d'intérêt n'a pas pu être ajoutée", "danger",
        interestMessage);
    console.error(err);
  }

}

export default ViewItemPage;
