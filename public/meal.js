const TableWidth = 870;
const TummyTableWidth = 810;

window.onload = function()
{
    ShowNewTummyForm(false);
    ShowSignedUpMessage(false);

    UpdateAsync();
    setInterval(UpdateAsync, 60000);
};

function UpdateAsync()
{
    var mealId = GetUrlParameter("mealid");

    $.ajax(
    {
        url: "getmeal/?mealid=" + mealId,
        success: OnReceivedMeal
    });

    $.ajax(
    {
        url: "gettummies/?mealid=" + mealId,
        success: OnReceivedTummies
    });
}

function OnReceivedMeal(result)
{  
    var mealInfo = JSON.parse(result);
    var name = mealInfo.name.trim();
    var type = mealInfo.mealType != undefined ? mealInfo.mealType.trim() : "";
    var menu = mealInfo.menu != undefined ? mealInfo.menu.trim() : "";
    var cutoff = mealInfo.cutoff != undefined ? mealInfo.cutoff.trim() : "";

    var htmlObj = new HTMLObj();
    htmlObj.BeginTable(TableWidth);
    htmlObj.BeginRow();
    htmlObj.BeginColumn();

    htmlObj.AddHTML("<b><span style='font-size: 50px;'>" + name + "</span></b>");

    if (type.length > 0)
    {
        htmlObj.AddHTML("<br/><b>Meal Type:</b> " + type);
    }

    if (menu.length > 0)
    {
        htmlObj.AddHTML("<br/><b>Menu:</b> <a href='" + ConvertToValidHREF(menu) + "' target='_blank'>" + menu + "</a>");
    }

    if (cutoff.length > 0)
    {
        htmlObj.AddHTML("<br/><b>Cutoff Time:</b> " + Time24To12(cutoff));
    }

    htmlObj.EndColumn();
    htmlObj.EndRow();
    htmlObj.EndTable();
    htmlObj.ApplyToID("meal");
}

function OnReceivedTummies(result)
{
    var resultJSON = JSON.parse(result);
    var tummies = resultJSON.tummies;
    var htmlObj = new HTMLObj();

    // I guess I could have the server calculate this, but whatever...
    var numTummies = tummies.length;
    var numVeggies = 0;
    tummies.forEach(function(tummy)
    {
        if (tummy.veggie != null && tummy.veggie != undefined)
        {
            numVeggies++;
        }
    });

    // It looks better to omit this if there aren't any tummies signed up yet
    if (numTummies > 0)
    {
        htmlObj.BeginTable(TableWidth);
        htmlObj.BeginRow();
        htmlObj.BeginColumn();

        htmlObj.AddHTML("<span style='font-size: 30px;'>" + GetTummiesLabel(numTummies) + "</span><br/>");
        if (numVeggies > 0)
        {
            htmlObj.AddHTML("<span style='font-size: 20px;'>" + GetVeggieOptionsLabel(numVeggies) + "</span>");
        }
        
        htmlObj.EndColumn();
        htmlObj.EndRow();
        htmlObj.EndTable();
    }

    htmlObj.BeginTable(TummyTableWidth);
    htmlObj.BeginRow();

    htmlObj.BeginColumnHeader(200, 5);
    htmlObj.AddHTML("Who's Eating?");
    htmlObj.EndColumnHeader();

    htmlObj.BeginColumnHeader(450, 5);
    htmlObj.AddHTML("Order / Special Instructions");
    htmlObj.EndColumnHeader();

    htmlObj.BeginColumnHeader(120, 5);
    htmlObj.AddHTML("Veggie Option?");
    htmlObj.EndColumnHeader();

    htmlObj.EndRow();

    var shouldShowNewTummyForm = true;
    if (tummies.length > 0)
    {
        var isOddRow = false;
        tummies.forEach(function (tummy)
        {
            // For now, simply hide the new tummy form if we're already on the list.
            // However, we may want to enable this if someone wants to add multiple tummies? Not sure what the best approach is yet...
            if (GetCookie(tummy._id) != null)
            {
                shouldShowNewTummyForm = false;
            }

            htmlObj.BeginRow(GetRowColor(isOddRow));
            isOddRow = !isOddRow;

            htmlObj.BeginColumn(undefined, 5);
            htmlObj.AddHTML(tummy.name.trim());
            htmlObj.EndColumn();

            htmlObj.BeginColumn(undefined, 5);
            htmlObj.AddHTML(tummy.special.trim());
            htmlObj.EndColumn();

            htmlObj.BeginColumn(undefined, 5);
            if (tummy.veggie != undefined)
            {
                htmlObj.AddHTML("<center>X</center>");
            }
            htmlObj.EndColumn();

            htmlObj.EndRow();
        });
    }
    else
    {
        htmlObj.BeginRow(GetRowColor(true));

        htmlObj.BeginColumn(undefined, 5);
        htmlObj.AddHTML("Nobody yet...");
        htmlObj.EndColumn();

        htmlObj.BeginColumn(undefined, 5);
        htmlObj.EndColumn();

        htmlObj.BeginColumn(undefined, 5);
        htmlObj.EndColumn();

        htmlObj.EndRow();
    }
    
    htmlObj.EndTable();
    htmlObj.ApplyToID("tummies");

    if (shouldShowNewTummyForm)
    {
        ShowNewTummyForm(true);
    }
    else
    {
        ShowSignedUpMessage(true);
    }
}

function GetTummiesLabel(count)
{
    var label = "Feeding " + count + " ";
    if (count == 1)
    {
        label += "Tummy";
    }
    else
    {
        label += "Tummies";
    }

    return label;
}

function GetVeggieOptionsLabel(count)
{
    var label = "(Including " + count + " Veggie ";
    if (count == 1)
    {
        label += "Option)";
    }
    else
    {
        label += "Options)";
    }

    return label;
}

function GetRowColor(isOddRow)
{
    if (isOddRow)
    {
        return "#D1D8FF";
    }

    return "#AAB8FF";
}

function ShowNewTummyForm(show)
{
    if (show)
    {
        $("#hiddenmealid").val(GetUrlParameter("mealid"));
        $("#newtummy").show();
    }
    else
    {
        $("#newtummy").hide();
    }
}

function ShowSignedUpMessage(show)
{
    if (show)
    {
        $("#signedup").show();
    }
    else
    {
        $("#signedup").hide();
    }
}