let selectedTiles;

fetch("https://www.endpoints.ch/api/2132/tiles")
  .then((response) => response.json())
  .then((data) => {
    console.log("🚀 ~ .then ~ data:", data);
    setImages(data);
    addEventListeners();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    alert("Error fetching data");
  });

function setImages(data) {
  const container = document.getElementById("puzzle");
  data.forEach((tile, index) => {
    const img = Object.assign(document.createElement("img"), {
      className: "piece",
      src: `images/${tile.url}`,
    });
    img.setAttribute("data-piece", tile.piece);
    img.setAttribute("data-position", index + 1);
    container.appendChild(img);
  });

  const img = Object.assign(document.createElement("img"), {
    className: "piece blank",
    src: `images/blank.png`,
  });
  img.setAttribute("data-piece", 9);
  img.setAttribute("data-position", 9);
  container.appendChild(img);
}

function addEventListeners() {
  document.querySelectorAll("img.piece").forEach((tile) => {
    tile.addEventListener("click", () => {
      if (selectedTiles && selectedTiles !== tile) {
        selectedTiles.classList.remove("selected");
      }
      if (tile.classList.contains("selected")) {
        selectedTiles = null;
      } else {
        selectedTiles = tile;
      }
      tile.classList.toggle("selected");
    });
  });

  window.addEventListener("keyup", (event) => {
    if (selectedTiles) {
      const tilesPosition = getTilesPosition();
      const selectedTilePiece = parseInt(
        selectedTiles.getAttribute("data-piece")
      );
      if (checkValidMove(selectedTilePiece, event.key, tilesPosition)) {
        console.log("valid move");
        swap(selectedTilePiece);
      }

      console.log(selectedTiles.getAttribute("data-position"));
    }
  });
}

function getTilesPosition() {
  const tiles = document.querySelectorAll("img.piece");
  const result = [];
  tiles.forEach((tile) => {
    result.push(parseInt(tile.getAttribute("data-piece")));
  });
  return result;
}

// direction: up, down, left, right
// selectedTilePosition: 1-8
// tilesPosition: [1,2,3,4,5,6,7,8,9] 9 is for blank
function checkValidMove(selectedTilePosition, direction, tilesPosition) {
  const selectedTilesIndex = tilesPosition.indexOf(selectedTilePosition);
  const blankTilesIndex = tilesPosition.indexOf(9);
  if (direction === "ArrowDown") {
    if (selectedTilesIndex + 3 === blankTilesIndex) {
      return true;
    }
    return false;
  }

  if (direction === "ArrowUp") {
    if (selectedTilesIndex - 3 === blankTilesIndex) {
      return true;
    }
    return false;
  }
  if (direction === "ArrowLeft") {
    if (
      selectedTilesIndex - 1 === blankTilesIndex &&
      selectedTilesIndex % 3 !== 0
    ) {
      return true;
    }
    return false;
  }

  if (direction === "ArrowRight") {
    if (
      selectedTilesIndex + 1 === blankTilesIndex &&
      selectedTilesIndex % 3 !== 2
    ) {
      return true;
    }
    return false;
  }
  return false;
}

function swap(selectedTilePiece) {
  // 1- find  the img with data-piece = selectedTilePiece
  // 2- find the img with data-piece = 9 (blank)
  // 3-swap the img tags of these two
  const selectedTile = document.querySelector(
    `img[data-piece="${selectedTilePiece}"]`
  );
  const blankTile = document.querySelector(`img[data-piece="9"]`);
  if (!selectedTile || !blankTile) return;

  // Clone the nodes
  const selectedClone = selectedTiles.cloneNode(true);
  const blankClone = blankTile.cloneNode(true);

  selectedClone.addEventListener("click", () => {
    if (selectedTiles && selectedTiles !== tile) {
      selectedTiles.classList.remove("selected");
    }
    if (tile.classList.contains("selected")) {
      selectedTiles = null;
    } else {
      selectedTiles = tile;
    }
    tile.classList.toggle("selected");
  });

  // Replace each node with the other's clone
  selectedTile.replaceWith(blankClone);
  blankTile.replaceWith(selectedClone);
  selectedClone.classList.remove("selected");
  selectedTiles = null;
}
