function HTMLObj()
{
    this.content = "";

    this.BeginTable = function(width)
    {
        this.content += "<table width='" + width + "' style='padding:5px 5px 5px 5px'>";
    };

    this.EndTable = function()
    {
        this.content += "</table>";
    };

    this.BeginRow = function(bgColor)
    {
        this.content += "<tr";
        this.AppendRowAttributes(bgColor)
        this.content += ">";
    };

    this.EndRow = function()
    {
        this.content += "</tr>";
    };

    this.AppendRowAttributes = function(bgColor)
    {
        if (bgColor != undefined)
        {
            this.content += " bgcolor='" + bgColor + "'";
        }
    };

    this.BeginColumn = function(width, padding)
    {
        this.content += "<td";
        this.AppendColumnAttributes(width, padding);
        this.content += ">";
    };

    this.EndColumn = function()
    {
        this.content += "</td>";
    };

    this.BeginColumnHeader = function(width, padding)
    {
        this.content += "<th";
        this.AppendColumnAttributes(width, padding);
        this.content += ">";
    };

    this.EndColumnHeader = function()
    {
        this.content += "</th>";
    };

    this.AppendColumnAttributes = function(width, padding)
    {
        this.content += " align='left'";

        if (width != undefined && width > 0)
        {
            this.content += " width='" + width + "'";
        }

        if (padding != undefined && padding > 0)
        {
            this.content += " style='padding:" + padding + "px " + padding + "px " + padding + "px " + padding + "px'";
        }
    };

    this.AddHTML = function(html)
    {
        this.content += html;
    };

    this.ApplyToID = function(nodeId)
    {
        $("#" + nodeId).html(this.content);
    };
}