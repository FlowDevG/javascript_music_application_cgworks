async function loadTracks() {
  const response = await fetch("tracks.json");
  const data = await response.json();

  const music = new Audio("tracks/littleidea.mp3");

  // Push data to Right Top UI
  Array.from(document.getElementsByClassName("right_wrapper_top_item")).forEach(
    (element, i) => {
      element.getElementsByClassName("top_item_image")[0].src =
        data[i].thumbnail;
      element.getElementsByClassName(
        "right_wrapper_top_item_title"
      )[0].innerHTML = data[i].title;
    }
  );

  // Push data to Right Bottom UI
  Array.from(
    document.getElementsByClassName("right_wrapper_bottom_item")
  ).forEach((element, i) => {
    element.getElementsByClassName("bottom_item_image")[0].src =
      data[i].thumbnail;
    element.getElementsByClassName(
      "right_wrapper_bottom_item_desc_title"
    )[0].innerHTML = data[i].title;
  });

  // Push data to Right Middle UI
  Array.from(
    document.getElementsByClassName("right_wrapper_middle_item")
  ).forEach((element, i) => {
    element.getElementsByClassName("middle_item_image")[0].src =
      data[i].thumbnail;
    element.getElementsByClassName(
      "right_wrapper_middle_item_desc_title"
    )[0].innerHTML = data[i].title;
  });

  // Push data to the left menu UI
  Array.from(
    document.getElementsByClassName("left_wrapper_menu_bottom")
  ).forEach((element, i) => {
    // console.log(element);
    element.getElementsByClassName("left_wrapper_menu_bottom_title").innerText =
      data[i].title;
  });

  let playButtonBottom = document.getElementById("bottom_middle_pause_play");
  playButtonBottom.addEventListener("click", () => {
    if (music.paused || music.currentTime <= 0) {
      music.play();
      playButtonBottom.classList.replace("bi-play-fill", "bi-pause");
    } else {
      music.pause();
      playButtonBottom.classList.replace("bi-pause", "bi-play-fill");
    }
  });

  const PlayAll = () => {
    Array.from(document.getElementsByClassName("top_item_button")).forEach(
      (element) => {
        element.classList.replace("bi-pause", "bi-play-fill");
      }
    );
  };

  let index = 0;
  let bottomLeftImg = document.getElementById("bottom_leftIMG");
  let bottomLeftItemTitle = document.getElementById("bottom_leftTitle");
  let bottomLeftItemArtist = document.getElementById("bottom_leftArtist");
  Array.from(document.getElementsByClassName("top_item_button")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        index = e.target.id;
        PlayAll();
        e.target.classList.replace("bi-play-fill", "bi-pause");
        music.src = `${data[index - 1].filename}`;
        bottomLeftImg.src = `${data[index - 1].thumbnail}`;
        music.play();

        let music_title_artist = data.filter((el) => {
          return el.id == index;
        });

        music_title_artist.forEach((el) => {
          let { title, artist } = el;
          bottomLeftItemTitle.innerHTML = title;
          bottomLeftItemArtist.innerHTML = artist;
        });
        playButtonBottom.classList.replace("bi-play-fill", "bi-pause");
        music.addEventListener("ended", () => {
          playButtonBottom.classList.replace("bi-pause", "bi-play-fill");
        });
      });

      // Music Start - End Time
      let startTime = document.getElementById("startTime");
      let endTime = document.getElementById("endTime");
      let lineContainer = document.getElementById("lineContainer");
      let actualLine = document.getElementById("actualLine");
      music.addEventListener("timeupdate", () => {
        let currentMusic = music.currentTime;
        let durationMusic = music.duration;
        let end_min = Math.floor(durationMusic / 60);
        let end_sec = Math.floor(durationMusic % 60);
        if (end_sec < 10) {
          end_sec = `0${end_sec}`;
        }
        endTime.innerText = `${end_min}:${end_sec}`;

        let start_min = Math.floor(currentMusic / 60);
        let start_sec = Math.floor(currentMusic % 60);
        if (start_sec < 10) {
          start_sec = `0${start_sec}`;
        }
        startTime.innerText = `${start_min}:${start_sec}`;

        // Progress Bar
        let progressBar = parseInt((music.currentTime / music.duration) * 100);
        lineContainer.value = progressBar;
        let lineSeek = lineContainer.value;
        actualLine.style.width = `${lineSeek}%`;
      });
      lineContainer.addEventListener("change", () => {
        music.currentTime = (lineContainer.value * music.duration) / 100;
      });
      music.addEventListener("ended", () => {
        playButtonBottom.classList.replace("bi-play-fill", "bi-pause");
      });

      let volumeUp = document.getElementById("volumeUp");
      let volumeContainer = document.getElementById("volumeContainer");
      let volumeLine = document.getElementById("volumeLine");

      volumeContainer.addEventListener("change", () => {
        if (volumeContainer.value == 0) {
          volumeUp.classList.remove("bi-volume-down");
          volumeUp.classList.add("bi-volume-mute");
          volumeUp.classList.add("bi-volume-up");
        }
        if (volumeContainer.value > 0) {
          volumeUp.classList.add("bi-volume-down");
          volumeUp.classList.remove("bi-volume-mute");
          volumeUp.classList.remove("bi-volume-up");
        }
        if (volumeContainer.value > 50) {
          volumeUp.classList.remove("bi-volume-down");
          volumeUp.classList.remove("bi-volume-mute");
          volumeUp.classList.add("bi-volume-up");
        }

        let currentVolume = volumeContainer.value;
        volumeContainer.style.width = `${currentVolume}%`;
        music.volume = currentVolume / 100;
      });
    }
  );
  let prev = document.getElementById("prev");
  let next = document.getElementById("next");

  // Prev Track Button
  prev.addEventListener("click", () => {
    index -= 1;
    if (index < 1) {
      index = Array.from(
        document.getElementsByClassName("right_wrapper_top_item")
      ).length;
    }

    music.src = `${data[index - 1].filename}`;
    bottomLeftImg.src = `${data[index - 1].thumbnail}`;
    music.play();

    let music_title_artist = data.filter((el) => {
      return el.id == index;
    });

    music_title_artist.forEach((el) => {
      let { title, artist } = el;
      bottomLeftItemTitle.innerHTML = title;
      bottomLeftItemArtist.innerHTML = artist;
    });
    PlayAll();
  });
  // Next Track Button
  next.addEventListener("click", () => {
    index -= 0;
    index += 1;
    if (
      index >
      Array.from(document.getElementsByClassName("right_wrapper_top_item"))
        .length
    ) {
      index = 1;
    }

    music.src = `${data[index - 1].filename}`;
    bottomLeftImg.src = `${data[index - 1].thumbnail}`;
    music.play();

    let music_title_artist = data.filter((el) => {
      return el.id == index;
    });

    music_title_artist.forEach((el) => {
      let { title, artist } = el;
      bottomLeftItemTitle.innerHTML = title;
      bottomLeftItemArtist.innerHTML = artist;
    });
    PlayAll();
  });
}
loadTracks();
