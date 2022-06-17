import "./OptionParams.scss";
import React, { useEffect, useState } from "react";
import OpenDialogOptions = Electron.OpenDialogOptions;

interface ComputationParamTemplateBase {
  opt: string;
  name: string;
  type: "DIR_PATH" | "FILE_PATH" | "INT" | "DECIMAL" | "ENUM" | "BOOL";
  default: string | number | boolean | null;
  description?: string;
}

type ComputationParamTemplateEnum = {
  type: "ENUM",
  enumValues: string[];
} & ComputationParamTemplateBase;

type ComputationParamTemplateWithAdditionalParams = {
  type: "BOOL",
  additionalParamsIfEnabled: ( (ComputationParamTemplateBase & {type: "DIR_PATH" | "FILE_PATH" | "INT" | "DECIMAL";}) | ComputationParamTemplateEnum)[]
} & ComputationParamTemplateBase;

export type ComputationParamTemplate =
  (ComputationParamTemplateBase & {type: "DIR_PATH" | "INT" | "DECIMAL";}) |
  ComputationParamTemplateEnum |
  ComputationParamTemplateWithAdditionalParams;

export interface ComputationParamsMap {
  [opt: string]: string | number | null;
}


interface PropType {
  params: ComputationParamsMap;
  setParams: ( updateParams: (oldParams: ComputationParamsMap) => ComputationParamsMap ) => void;
  templateParams: ComputationParamTemplate[];
}

export const OptionParams: React.FC<PropType> = ({params, setParams, templateParams}) => {

  function getInputFieldType(templateParam: ComputationParamTemplate) {
    switch (templateParam.type) {
      case "BOOL":
        return "checkbox";
      case "INT":
      case "DECIMAL":
        return "number";
      default:
        throw Error("Param type not supported");
    }
  }

  function getParamValue(templateParam: ComputationParamTemplate) {
    return params[templateParam.opt];
  }

  function setParamValue(templateParam: ComputationParamTemplate, value: any) {
    let finalVal = value;
    if (templateParam.type === "INT" || templateParam.type === "DECIMAL") {
      if (Number.isNaN(finalVal)) {
        if (templateParam.type === "INT")
          finalVal = parseInt(finalVal, 10);
        else
          finalVal = parseFloat(finalVal);
      } else {
        finalVal = Math.round(finalVal);
      }
      if (Number.isNaN(finalVal))
        return;
    } else if (templateParam.type === "BOOL") {
      finalVal = finalVal && true;
    }
    setParams(oldParams => ({...oldParams, [templateParam.opt]: finalVal}));
  }

  function openDirPicker(templateParam: ComputationParamTemplate) {
    const defaultDir = getParamValue(templateParam) ? getParamValue(templateParam) : undefined;
    const options: OpenDialogOptions = {
      title: `Select ${templateParam.name}`,
      message: templateParam.description,
      properties: ["openDirectory"],
      defaultPath: defaultDir as string | undefined
    };
    window.electron.openFilePicker(options)
      .then((paths: string[]) => {
        if(paths.length > 0) {
          setParamValue(templateParam, paths[0]);
          return paths[0];
        }
        return null;
      }).catch(() => {});
  }

  function getInputFieldForParam(templateParam: ComputationParamTemplate) {
    
    const label = <div className="param-name">{templateParam.name}</div>;
    
    let description = <></>;
    if(templateParam.description)
      description = <div className="param-description">{templateParam.description}</div>;

    let inputField;
    switch (templateParam.type) {
      case "DIR_PATH":
        inputField = (
          <div className="dir-path-input" onClick={() => openDirPicker(templateParam)} >
            {getParamValue(templateParam) && getParamValue(templateParam)}
            {!getParamValue(templateParam) && 'SELECT A DIRECTORY'}
            <span className="material-symbols-outlined">
              folder_open
            </span>
          </div>
        );
        break;
      case "ENUM":
        inputField = (
          <select
            value={getParamValue(templateParam)}
            onChange={(e) => setParamValue(templateParam, e.target.value)}
          >
            {templateParam.enumValues.map(val => (
              <option value={val}>{val}</option>
            ))}
          </select>
        );
        break;
      case "BOOL":
        inputField = (
          <input
            checked={getParamValue(templateParam)}
            type="checkbox"
            onChange={() =>  setParamValue(templateParam, !getParamValue(templateParam))}
          />
        );
        break;
      case "INT":
      case "DECIMAL":
        inputField = (
          <input
            value={getParamValue(templateParam)}
            type="number"
            onChange={e =>  setParamValue(templateParam, e.target.value)}
          />
        );
        break;
      default:
        inputField = <>not yet supported!</>;
    }

    return (
      <div className={`param ${templateParam.type}`} key={templateParam.name}>
        {label}
        {description}
        {inputField}
      </div>
    );
    
  }

  useEffect(() => templateParams.forEach(tp => {
    setParamValue(tp, tp.default);
    if (tp.type === "BOOL" && "additionalParamsIfEnabled" in tp) {
      tp.additionalParamsIfEnabled
        .forEach(nestedTp => setParamValue(nestedTp, nestedTp.default));
    }
  }), []);

  return (
    <div className="computation-params">
      {templateParams.map(tp => {
        const showNestedChild = tp.type === "BOOL" && getParamValue(tp) && tp.additionalParamsIfEnabled.length > 0;
        return (
          <div className="param-block" key={tp.name}>
            {getInputFieldForParam(tp)}
            {showNestedChild &&
              <div className="nested-params">
                {tp.additionalParamsIfEnabled.map(nestedTp => getInputFieldForParam(nestedTp))}
              </div>
            }
          </div>
        );
      })}
    </div>
);


}