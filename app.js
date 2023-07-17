// Create URL variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((id) => {
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sampleOne = names[0];

        // Build the initial plots
        createMetadata(sampleOne);
        createBarChart(sampleOne);
        createBubbleChart(sampleOne);

    });
};

// Function that populates metadata info
function createMetadata(sample) {

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        let valueData = value[0];
        d3.select("#sample-metadata").html("");

        // Add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds the bar chart
function createBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data and filter based on sample value
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the otu IDs, lables, and sample values
        let valueData = value[0];
        let sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
        let otuIDs = data.samples[0].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
        let otuLabels = data.samples[0].otu_labels.slice(0, 10).reverse();

        // Set up the trace for the bar chart
        let trace = {
            x: sampleValues,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function createBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data and filter based on sample value
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the otu IDs, lables, and sample values
        let valueData = value[0];
        let otuIDs = valueData.otu_ids;
        let otuLabels = valueData.otu_labels;
        let sampleValues = valueData.sample_values;

        // Set up the trace for bubble chart
        let trace1 = {
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        // Plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Call all functions 
    createMetadata(value);
    createBarChart(value);
    createBubbleChart(value);
};

// Call the initialize function
init();