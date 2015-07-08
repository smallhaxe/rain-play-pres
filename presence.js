<html>
<head>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
  <meta charset="utf-8">
  <script src="https://cdn.firebase.com/js/client/2.2.1/firebase.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
  <script src="/resources/tutorial/js/libs/idle.js"></script>
  <link rel="stylesheet" type="text/css" href="/resources/tutorial/css/example.css">
</head>
<body>

<div id="presenceDiv" class="l-demo-container example-base">
</div>

<script>
  // Prompt the user for a name to use.
  var name = prompt("Your name?", "Guest");
  var currentStatus = "★ online";

  // Get a reference to the presence data in Firebase.
  var userListRef = new Firebase("https://c53soq356su.firebaseio-demo.com/");

  // Generate a reference to a new location for my user with push.
  var myUserRef = userListRef.push();

  // Get a reference to my own presence status.
  var connectedRef = new Firebase("https://c53soq356su.firebaseio-demo.com//.info/connected");

  connectedRef.on("value", function(isOnline) {
    if (isOnline.val()) {
      // If we lose our internet connection, we want ourselves removed from the list.
      myUserRef.onDisconnect().remove();

      // Set our initial online status.
      setUserStatus("★ online");
    }
    else {

      // We need to catch anytime we are marked as offline and then set the correct status. We
      // could be marked as offline 1) on page load or 2) when we lose our internet connection
      // temporarily.
      setUserStatus(currentStatus);
    }
  });

  // A helper function to let us set our own state.
  function setUserStatus(status) {
    // Set our status in the list of online users.
    currentStatus = status;
    myUserRef.set({ name: name, status: status });
  }

  function getMessageId(snapshot) {
    return snapshot.key().replace(/[^a-z0-9\-\_]/gi,'');
  }

  // Update our GUI to show someone"s online status.
  userListRef.on("child_added", function(snapshot) {
    var user = snapshot.val();

    $("<div/>")
      .attr("id", getMessageId(snapshot))
      .text(user.name + " is currently " + user.status)
      .appendTo("#presenceDiv");
  });

  // Update our GUI to remove the status of a user who has left.
  userListRef.on("child_removed", function(snapshot) {
    $("#presenceDiv").children("#" + getMessageId(snapshot))
      .remove();
  });

  // Update our GUI to change a user"s status.
  userListRef.on("child_changed", function(snapshot) {
    var user = snapshot.val();
    $("#presenceDiv").children("#" + getMessageId(snapshot))
      .text(user.name + " is currently " + user.status);
  });

  // Use idle/away/back events created by idle.js to update our status information.
  document.onIdle = function () {
    setUserStatus("☆ idle");
  }
  document.onAway = function () {
    setUserStatus("☄ away");
  }
  document.onBack = function (isIdle, isAway) {
    setUserStatus("★ online");
  }

  setIdleTimeout(5000);
  setAwayTimeout(10000);
</script>
</body>
</html>
