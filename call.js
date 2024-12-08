// Start Call Button - Simulate starting a call
document.getElementById('startCall').addEventListener('click', function() {
    alert("Starting the call...");
});
// Handle Topic Selection
document.querySelectorAll('#topicModal .list-group-item').forEach(item => {
    item.addEventListener('click', function() {
        const selectedTopic = this.getAttribute('data-topic');
        document.getElementById('selectedTopic').textContent = `Topic: ${selectedTopic}`;
        $('#topicModal').modal('hide');
    });
});

// Handle Country Selection
document.querySelectorAll('#countryModal .list-group-item').forEach(item => {
    item.addEventListener('click', function() {
        const selectedCountry = this.getAttribute('data-country');
        document.getElementById('selectedCountry').textContent = `Country: ${selectedCountry}`;
        $('#countryModal').modal('hide');
    });
});

// for enable function
$(document).ready(function () {
    // When a topic is selected
    $(".list-group-item").click(function () {
        var selectedTopic = $(this).data("topic");
        $("#selectedTopic").text(selectedTopic);
        checkForMatch();
    });

    // When a country is selected
    $(".list-group-item").click(function () {
        var selectedCountry = $(this).data("country");
        $("#selectedCountry").text(selectedCountry);
        checkForMatch();
    });

    // Function to check if two users are matched
    function checkForMatch() {
        var topic = $("#selectedTopic").text();
        var country = $("#selectedCountry").text();
        
        if (topic !== "No Topic Selected" && country !== "No Country Selected") {
            $.ajax({
                url: "/matchmaking",
                method: "POST",
                data: { topic: topic, country: country },
                success: function (response) {
                    if (response.matchFound) {
                        initiateCall(response.callData);
                    }
                }
            });
        }
    }

    // Function to initiate a call
    function initiateCall(callData) {
        var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        
        client.init("your-app-id", function () {
            client.join(callData.token, callData.channelName, null, function (uid) {
                var localStream = AgoraRTC.createStream({
                    streamID: uid,
                    audio: true,
                    video: false,
                });

                localStream.init(function () {
                    client.publish(localStream, function (err) {
                        console.log("Publish failed: " + err);
                    });
                });

            }, function (err) {
                console.log("Join channel failed: " + err);
            });

        }, function (err) {
            console.log("AgoraRTC client init failed: " + err);
        });
    }
});
