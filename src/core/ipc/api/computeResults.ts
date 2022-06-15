import { getComputeResultsJarPath } from "./fs";
import * as child_process from "child_process";

export async function computeResults(options) {
  const jarPath = getComputeResultsJarPath();
  console.log("cp", jarPath);
  const child = child_process.spawn( 'java', ['-jar', jarPath, ''] );
  console.log("c", child);
 /*  var kill = require(‘tree-kill’);
  kill(child.pid); */

  var scriptOutput = "";

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(data) {
    //Here is where the output goes

    console.log('stdout: ' + data);

    data=data.toString();
    scriptOutput+=data;
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function(data) {
    //Here is where the error output goes

    console.log('stderr: ' + data);

    data=data.toString();
    scriptOutput+=data;
  });

  child.on('close', function(code) {
    //Here you can get the exit code of the script

    console.log('closing code: ' + code);

    console.log('Full output of script: ',scriptOutput);
  });

  return "test1";
}

