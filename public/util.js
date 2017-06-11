function GetUrlParameter(name)
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
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0)
        {
            return null;
        }
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1)
        {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}