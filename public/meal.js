window.onload = function()
{
  UpdateMeal();
  UpdateTummies();
};

window.setInterval(UpdateTummies, 15000);

function UpdateMeal()
{
  $.ajax({url: "getmeal/?mealid=" + getUrlParameter("mealid"), success: function(result)
    {
      var resultJSON = JSON.parse(result);
      var mealInfoHTML = "<table width='870' style='padding:5px 5px 5px 5px'>";
      
      mealInfoHTML += "<tr>"
      mealInfoHTML += "<td align='left'>";
      
      mealInfoHTML += "<b><span style='font-size: 50px;'>" + resultJSON.name + "</span></b>";
      
      if (resultJSON.mealtype.trim().length > 0)
      {
        mealInfoHTML += "<br/>";
        mealInfoHTML += "<b>Meal Type:</b> " + resultJSON.mealtype;
      }
      
      if (resultJSON.menu.trim().length > 0)
      {
        console.log(encodeURI(resultJSON.menu));
        mealInfoHTML += "<br/>";
        mealInfoHTML += "<b>Menu:</b> <a href='" + ConvertToValidHREF(resultJSON.menu) + "' target='_blank'>" + resultJSON.menu + "</a>";
      }
      
      if (resultJSON.cutoff.trim().length > 0)
      {
        mealInfoHTML += "<br/>";
        mealInfoHTML += "<b>Cutoff Time:</b> " + Time24To12(resultJSON.cutoff);
      }

      mealInfoHTML += "</td>";
      mealInfoHTML += "</tr>"
      
      mealInfoHTML += "</table>"
      $("#meal").html(mealInfoHTML);
    }});
}

function UpdateTummies()
{
  $.ajax({url: "gettummies/?mealid=" + getUrlParameter("mealid"), success: function(result)
    {
      var darkRow = false;
      var resultJSON = JSON.parse(result);
      var tummyTableHTML = "";
      var showNewTummyForm = true;
      
      if (resultJSON.tummies.length > 0)
      {
        tummyTableHTML = "<table width='870' style='padding:5px 5px 5px 5px'>";

        tummyTableHTML += "<tr>"
        tummyTableHTML += "<td align='left'>";
        
        var numTummiesTotal = resultJSON.tummies.length;
        var numVeggies = 0;
        resultJSON.tummies.forEach(function (tummy)
        {
          if (tummy.veggie != null && tummy.veggie != undefined)
          {
            numVeggies++;
          }
        });
        
        var tummyTotalStr = "";
        if (numTummiesTotal == 1)
        {
          tummyTotalStr = "Feeding 1 Tummy";
        }
        else
        {
          tummyTotalStr = "Feeding " + numTummiesTotal + " Tummies";
        }
        
        var veggieStr = "";
        if (numVeggies == 1)
        {
          veggieStr = "(Including 1 Veggie Option)";
        }
        else
        {
          veggieStr = "(Including " + numVeggies + " Veggie Options)";
        }

        tummyTableHTML += "<span style='font-size: 30px;'>" + tummyTotalStr + "</span><br/>";
        if (numVeggies > 0)
        {
          tummyTableHTML += "<span style='font-size: 20px;'>" + veggieStr + "</span>";
        }
        tummyTableHTML += "</tr></td></table>";
      }
      
      tummyTableHTML += "<table>";
      tummyTableHTML += "<tr>";
      tummyTableHTML += "<th align='left' width='200' style='padding:5px 5px 5px 5px'>Who's Eating?</th>";
      tummyTableHTML += "<th align='left' width='450' style='padding:5px 5px 5px 5px'>Order / Special Instructions</th>";
      tummyTableHTML += "<th align='left' width='120' style='padding:5px 5px 5px 5px'>Veggie Option?</th>";
      tummyTableHTML += "</tr>";
      
      if (resultJSON.tummies.length > 0)
      {
        resultJSON.tummies.forEach(function (tummy)
        {
          if (GetCookie(tummy._id) != null)
          {
            showNewTummyForm = false;
          }
          
          if (darkRow)
          {
            tummyTableHTML += "<tr bgcolor='#AAB8FF'>";
          }
          else
          {
            tummyTableHTML += "<tr bgcolor='#D1D8FF'>";
          }
          darkRow = !darkRow;

          tummyTableHTML += "<td  align='left' style='padding:5px 5px 5px 5px'>";
          tummyTableHTML += tummy.name;
          tummyTableHTML += "</td>";

          tummyTableHTML += "<td  align='left' style='padding:5px 5px 5px 5px'>";
          if (tummy.special != null && tummy.special != undefined)
          {
            tummyTableHTML += tummy.special;
          }
          tummyTableHTML += "</td>";

          tummyTableHTML += "<td  align='left' style='padding:5px 5px 5px 5px'>";
          if (tummy.veggie != null && tummy.veggie != undefined)
          {
            tummyTableHTML += "<center>X</center>";
          }
          tummyTableHTML += "</td>";

          tummyTableHTML += "</tr>";
        });
      }
      else
      {
        tummyTableHTML += "<tr bgcolor='#AAB8FF'>";
        
        tummyTableHTML += "<td  align='left' style='padding:5px 5px 5px 5px'>";
        tummyTableHTML += "Nobody yet...";
        tummyTableHTML += "</td>";

        tummyTableHTML += "<td  align='left' style='padding:5px 5px 5px 5px'/>";
        tummyTableHTML += "<td  align='left' style='padding:5px 5px 5px 5px'/>";

        tummyTableHTML += "</tr>";
      }
      tummyTableHTML += "</table>";
      
      $("#tummies").html(tummyTableHTML);

      ShowNewTummyForm(showNewTummyForm);
    }}); 
}

function ShowNewTummyForm(show)
{
  var newTummyFormHTML = "";
  
  if (show)
  {
    newTummyFormHTML = `<form action='/createtummy' method='post'>
    <table>            
      <tr>
        <td>
          <label for='name'>Name:</label>
          <br/>
          <input type='text' id='name' name='name' placeholder='John Smith' size="40" maxlength="100" required pattern="[\\s\\S]*\\S[\\s\\S]*" title="Please enter a valid name :)"/>
        </td>
      </tr>

      <tr>
        <td>
          <label for='email'>Email (we'll use this to notify you when food is here):</label>
          <br/>
          <input type='email' id='email' name='email' placeholder='john.smith@work.com' size="40" maxlength="100"/>
        </td>
      </tr>

      <tr>
        <td>
          <label for='special'>Order / Special Instructions (optional):</label>
          <br/>
          <textarea name="special" id='special' style='width:435px;height:110px;' placeholder='Cheeseburger and Fries\n-or-\nCan we get some breadsticks too?' maxlength="200"/>
        </td>
      </tr>

      <tr>
        <td>
          <label for='veggie'>Veggie Option?:</label>
          <!--<br/>-->
          <input type='checkbox' id='veggie' name='veggie'/>
        </td>
      </tr>

      <tr>
        <td>
          <center>
            <input type="image" src="https://cdn.glitch.com/db80d9ba-ffb2-41b7-a6f5-db784958faa4%2FIWantFood.png?1496620864843" alt="Submit Form" width="192" height="96" border="0"/>
          </center>
        </td>
      </tr>
    </table>

    <br/>

    <input type='hidden' name='mealid' value='` + getUrlParameter("mealid") + `' />
  </form>`;
  }
  else
  {
    newTummyFormHTML = "<table width='870' style='padding:5px 5px 5px 5px'>";
    newTummyFormHTML += "<tr>"
    newTummyFormHTML += "<td align='left'>";
    newTummyFormHTML += "<span style='font-size: 20px; color: #009900'><b>You're signed up!</b></span><br/>";
    newTummyFormHTML += "</tr></td></table>";
  }
  
  if ((show && $("#newtummy").html().length <= 20) ||
      (!show && $("#newtummy").html().length > 0))
  {
    $("#newtummy").html(newTummyFormHTML);
  }
}

function getUrlParameter(name)
{
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function Time24To12(time)
{
    var timeParts = time.split(":");
    var ampm = 'AM';

    if (timeParts[0] >= 12)
    {
        ampm = 'PM';
    }

    if (timeParts[0] > 12)
    {
        timeParts[0] = timeParts[0] - 12;
    }

    var time12Hour = timeParts[0] + ':' + timeParts[1] + ' ' + ampm;

    return time12Hour;
}

function ConvertToValidHREF(url)
{
  if (!/^https?:\/\//i.test(url))
  {
    url = 'http://' + url;
  }
  
  return url;
}

function GetCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}