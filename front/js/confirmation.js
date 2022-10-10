function getIdCommand() {
    const URL_PARAMS = new URLSearchParams(window.location.search);
    orderId.innerText = URL_PARAMS.get("_id");
    }
  getIdCommand();