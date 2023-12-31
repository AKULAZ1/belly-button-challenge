// Create two variables to hold the information from the names and samples arrays, respectively
var ids = [];
var samples = [];
var metadata = [];

// Connect to the API
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(
    // If connection is successful, then
    data => {
        // Get the information from each of the arrays
        ids = data.names;
        samples = data.samples;
        metadata = data.metadata;
        //Run function to populate dropdown menu to select the "Test Subject ID No."
        loadIds();
        //Run function to get information necessary to build and diplay charts
        optionChanged(ids[0]);
    }
)

//Function to populate the dropdown menu "Test Subject ID No." 
function loadIds()
{
    for(let i=0; i < ids.length; i++)
    {
        //The following snippet, which loops through all the sample ids and adds them as "clickable" options 
        //to the dropdown menu, was sourced from a Stack Overflow board.
        var option = document.createElement("option");
        option.text = ids[i];
        selDataset.add(option);
    }   
}

//Function to get the information required to display bar chart featuring the Top 10 OTUs for each Test ID
function optionChanged(selectedId)
{
    for( i=0; i < samples.length; i++)
    {
        //Loops through each selected ID to find its matching dictionary in the samples array 
        if(selectedId == samples[i].id)
        {
            //Upon identifying a match, stores all the otu_ids (for the bubble chart) and the top 10 (for the bar chart)
            var otu_ids_10 = samples[i].otu_ids.slice(0,10);
            var otu_ids_all = samples[i].otu_ids;

            //Modifies each ID value for the bar chart by adding the phrase "OTU" in front to match the example images
            for(let i =0; i < otu_ids_10.length; i++)
            {
                otu_ids_10[i] = 'OTU ' + otu_ids_10[i]; 
            }

            //Grabs the matching OTU values and labels, respectively, for the bar chart
            var otu_values_10 = samples[i].sample_values.slice(0,10);
            var otu_labels_10 = samples[i].otu_labels.slice(0,10);

            //Grabs the matching OTU values and labels, repectively, for the bubble chart
            var otu_values_all = samples[i].sample_values;
            var otu_labels_all = samples[i].otu_labels;

            //Runs the BarChart function, which displays a new plot for each new selection on the dropdown menu
            refreshBarChart(otu_ids_10, otu_values_10, otu_labels_10);

            //Runs the BubbleChart function
            refreshBubbleChart(otu_ids_all, otu_values_all, otu_labels_all); 

            // Runs the DemoKey function
            refreshDemoInfo(selectedId);
            break;
        }
    }
};

//Function to create a new BarChart based on the selected Test Subject ID No.
function refreshBarChart(otu_ids_10, otu_values_10, otu_labels_10)
{
    var data = [{
        y: otu_ids_10, 
          x: otu_values_10,
          text: otu_labels_10,
          type: 'bar',
          orientation: 'h',
          //The snippet of code falling under "transforms", which orders the bar chart in ascending order, 
          //was sourced from community.plotly.com
          transforms: [{
            type: 'sort',
            target: 'x',
            order: 'ascending'
          }]
        }];

    var layout = {
        title: 'Top 10 OTUs Present',
        showlegend: false};

    //Displays the Bar Chart 
    Plotly.newPlot('bar', data, layout, {displayModeBar: true});
}

//Function to create a new BubbleChart based on the selected Test Subject ID No.
function refreshBubbleChart(otu_ids_all, otu_values_all, otu_labels_all)
{
    var trace1 = {
        x: otu_ids_all,
        y: otu_values_all,
        text: otu_labels_all,
        mode: 'markers',
        marker: {
          size: otu_values_all,
          color: otu_ids_all
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'All OTUs Present',
        showlegend: false,
        height: 600,
        width: 1200
      };

    //Displays the Bubble Chart 
    Plotly.newPlot('bubble', data, layout);
      
}

//Function to create a new Demographic Information Key based on the selected Test Subject ID No.
function refreshDemoInfo(selectedId)
{
    //Loops through metdata info to find dictionary that matches with the selectedID
    //and grabs all the necessary Demographic information
    for(i=0; i < metadata.length; i++)
    {
        if(selectedId == metadata[i].id)
        {
            //Stores demographic information in variables
            var id = "id: " + metadata[i].id;
            var ethnicity = "ethnicity: " + metadata[i].ethnicity;
            var gender = "gender: " + metadata[i].gender;
            var age = "age: " + metadata[i].age;
            var location = "location: " + metadata[i].location;
            var bbtype = "bbtype: " + metadata[i].bbtype;
            var wfreq = "wfreq: " + metadata[i].wfreq;

            //Appends all variables to a list
            let demo_info = [id, ethnicity, gender, age, location, bbtype, wfreq];

            //Sets the stage for the text elements to be overwritten on each run
            var elem = d3.select("p").remove();
            var demoStr = "";
            
            //Loops through list and displays information in the designated area
            for (i=0; i < demo_info.length; i++)
            {
                demoStr += "<p>" + demo_info[i] + "</p>";
            }
            // The .html command was sourced from tutorialsteacher.com to permit overwriting
            //of the html text elments rather than creating a long continuous list.
            d3.select("#sample-metadata").html(demoStr);
        }
    }
}
