$(document).ready(function () {
  $("#result").append(`<span class="kiri">Silahkan Bertanya..</span>`);
});

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    var input = document.getElementById("pesan");
    var pesan = input.value;
    if (pesan === "") {
      $("#pesan").css("outline", "3px solid #F45050");
    } else {
      kirimPesan();
      $("#pesan").css("outline", "none");
      sendMessage();
    }
  }
}

var audio = new Audio(
  "https://notificationsounds.com/storage/sounds/file-sounds-1231-out-of-nowhere.mp3"
);
var audio2 = new Audio(
  "https://notificationsounds.com/storage/sounds/file-sounds-1148-juntos.mp3"
);

function terimaPesan() {
  audio.play();
}
function kirimPesan() {
  audio2.play();
}

function sendMessage() {
  var input = document.getElementById("pesan");
  var pesan = input.value;
  $("#result").append(`<span class="kanan">` + pesan + `</span>`);
  $("#result").append(`<span class="kiri" id="load">Loading..</span>`);
  processUserMessage(pesan);
  input.value = "";
}

// Fungsi untuk memproses pesan pengguna dan memberikan respons
function processUserMessage(message) {
  var lowercaseMessage = message.toLowerCase().trim().replace(/-/g, " ");

  if (lowercaseMessage.includes("arti")) {
    var key = lowercaseMessage.split(" ");
    // console.log(key[key.length - 1]);
    SearchKata(key[key.length - 1]);
  } else if (lowercaseMessage.includes("hai")) {
    Message("Hallo! Ada yang bisa saya bantu?");
  } else if (lowercaseMessage.includes("salah")) {
    Message("Mohon maaf jika saya banyak salah");
  } else if (lowercaseMessage.includes("kabar")) {
    Message("Saya tidak memiliki perasaan atau kehidupan sebagaimana manusia");
  } else if (
    lowercaseMessage.includes("halo") ||
    lowercaseMessage.includes("hallo")
  ) {
    Message("Halo! Apa yang bisa saya bantu?");
  } else if (
    lowercaseMessage.includes("oke") ||
    lowercaseMessage.includes("baik")
  ) {
    Message("Baik! jika ada pertanyaan lain saya mungkin bisa jawab");
  } else if (lowercaseMessage.includes("namamu")) {
    Message("Saya adalah Chatbot.");
  } else if (lowercaseMessage.includes("terimakasih")) {
    Message("Sama-sama! Jika ada yang perlu ditanyakan, silakan.");
  } else if (lowercaseMessage.includes("motivasi")) {
    GetQuote();
  } else if (lowercaseMessage === "list anime") {
    GetListAnime();
  } else if (lowercaseMessage.includes("bersihkan")) {
    ClearMessage();
  } else {
    var check = lowercaseMessage.split(" ").length;
    if (check > 1) {
      Message("Maaf, saya tidak mengerti pesan Anda.");
    } else {
      SearchKata(lowercaseMessage);
    }
  }
}

function Message(chatbot) {
  $("#load").remove();
  $("#result").append(`<span class="kiri">` + chatbot + `</span>`);
  terimaPesan();
  var container = $("html");

  if (container.height() >= 720) {
    $("#result").css("paddingBottom", "50px");
  }

  container.animate(
    {
      scrollTop: container.height(),
    },
    800
  );
}

function ClearMessage() {
  $("#result").empty();
  Message("Pesan Sebelumnya Berhasil Di Hapus");
}

async function GetListAnime() {
  $.ajax({
    url: "https://katanime.vercel.app/api/getlistanime",
    type: "GET",
    success: function (data) {
      var dataAnime = data["result"];
      var list = "";

      for (let i = 0; i < dataAnime.length; i++) {
        list += dataAnime[i]["anime"] + "<br>";
      }
      Message(list);
    },
  });
}

async function GetQuote() {
  $.ajax({
    url: "https://katanime.vercel.app/api/getrandom",
    type: "GET",
    success: function (data) {
      var dat =
        data["result"][0]["indo"] +
        "<br><br>Quote Dari Anime " +
        data["result"][0]["anime"] +
        "<br>By : " +
        data["result"][0]["character"];
      console.log(dat);
      Message(dat);
    },
  });
}

async function SearchKata(key) {
  $.ajax({
    url: "http://localhost:5000/search?q=" + key,
    type: "GET",
    success: function (data) {
      var datas = data["data"]["resultLists"];

      for (let A = 0; A < datas.length; A++) {
        let artinya = "";
        if (datas[A]["arti"].length > 0) {
          for (let B = 0; B < datas[A]["arti"].length; B++) {
            artinya += datas[A]["arti"][B] + "<br>";
          }
          Message(
            "Arti Dari <b class='bg-key'>" + key + " </b> adalah " + artinya
          );
        } else {
          if (datas[A]["arti"].length == 0) {
            Message(
              "Maaf,saya tidak mengerti apa itu <b class='bg-key'>" +
                key +
                " </b>"
            );
          }

          if (datas.length < 1) {
            Message(
              "Maaf,saya tidak mengerti apa itu <b class='bg-key'>" +
                key +
                " </b>"
            );
          }
        }
      }
    },
    error: function (e) {
      Message("<b class='bg-key'>API :</b> " + e["statusText"]);
    },
  });
}

// Contoh penggunaan
// var userMessage = prompt("Pesan:"); // Mengambil input pesan dari pengguna melalui prompt
// processUserMessage(userMessage); // Memproses pesan pengguna dan memberikan respons
