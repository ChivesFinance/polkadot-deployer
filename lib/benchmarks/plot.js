
module.exports = {
  create: (data) => {
    let template = `$data << EOD`;

    data.forEach((item) => {
      const mean = avg(item.results);
      const std = standardDeviation(item.results, mean);
      template += `
${item.validators} ${mean} ${std}`
    });

    const xMin = data[0].validators - 0.5;
    const xMax = data[data.length - 1].validators + 0.5;
    template += `
EOD
set terminal png
set output "benchmark.png"
set xlabel "Number of validators"
set ylabel "Time to finality (msec)"
set grid
set xrange [${xMin}:${xMax}]

plot "$data" with linespoints title "Block finality time", \
     '' with labels center offset 3.4,.5 notitle
`;
    return template
  }
}

function standardDeviation(values, mean){
  if (!mean) {
    mean = avg(values);
  }

  const squareDiffs = values.map(function(value){
    const diff = value - mean;
    return diff * diff;
  });

  const avgSquareDiff = avg(squareDiffs);

  return Math.sqrt(avgSquareDiff).toFixed(1);
}

function avg(data){
  const sum = data.reduce((sum, value) => {
    return sum + value;
  }, 0);

  return sum / data.length;
}
