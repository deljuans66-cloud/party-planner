const root = document.getElementById("app");

const state = {
  parties: [],
  selectedParty: null,
  guests: [],
  rsvps: [],
};

const fetchParties = async () => {
  try {
    const response = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-FTB-ET-WEB-FT/events"
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching parties:", error);
    return [];
  }
};

const fetchGuests = async () => {
  try {
    const response = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-FTB-ET-WEB-FT/guests"
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching guests:", error);
    return [];
  }
};

const fetchRsvps = async () => {
  try {
    const response = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-FTB-ET-WEB-FT/rsvps"
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching rsvps:", error);
    return [];
  }
};

const fetchPartyById = async (id) => {
  try {
    const response = await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-FTB-ET-WEB-FT/events/${id}`
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching party with id ${id}:`, error);
    return null;
  }
};

const PartyList = (parties, selectedParty) => {
  const partyList = document.createElement("div");
  partyList.className = "party-list";
  const ul = document.createElement("ul");
  parties.forEach((party) => {
    const li = document.createElement("li");
    li.textContent = party.name;
    li.dataset.id = party.id;
    if (selectedParty && party.id === selectedParty.id) {
      li.classList.add("selected");
    }
    ul.appendChild(li);
  });
  partyList.appendChild(ul);
  return partyList;
};

const PartyDetails = (party, guests, rsvps) => {
  const partyDetails = document.createElement("div");
  partyDetails.className = "party-details";

  if (!party) {
    partyDetails.textContent = "Select a party to see details.";
    return partyDetails;
  }

  const partyRsvps = rsvps.filter((rsvp) => rsvp.eventId === party.id);
  const guestIds = partyRsvps.map((rsvp) => rsvp.guestId);
  const attendingGuests = guests.filter((guest) => guestIds.includes(guest.id));

  partyDetails.innerHTML = `
    <h2>${party.name}</h2>
    <p><strong>ID:</strong> ${party.id}</p>
    <p><strong>Date:</strong> ${new Date(party.date).toLocaleDateString()}</p>
    <p><strong>Description:</strong> ${party.description}</p>
    <p><strong>Location:</strong> ${party.location}</p>
    <h3>Guests:</h3>
    <ul>
      ${attendingGuests
        .map((guest) => `<li>${guest.name} - ${guest.email}</li>`)
        .join("")}
    </ul>
  `;
  return partyDetails;
};

const App = () => {
  const app = document.createElement("div");
  app.className = "app";
  app.appendChild(PartyList(state.parties, state.selectedParty));
  app.appendChild(PartyDetails(state.selectedParty, state.guests, state.rsvps));
  return app;
};

const render = () => {
  root.innerHTML = "";
  root.appendChild(App());
};

const handlePartyClick = async (event) => {
  if (event.target.tagName === "LI") {
    const partyId = event.target.dataset.id;
    const party = await fetchPartyById(partyId);
    updateState({ selectedParty: party });
  }
};

const updateState = (newState) => {
  Object.assign(state, newState);
  render();
};

const init = async () => {
  const parties = await fetchParties();
  const guests = await fetchGuests();
  const rsvps = await fetchRsvps();
  updateState({ parties, guests, rsvps });
  root.addEventListener("click", handlePartyClick);
};

init();
