import { ComputationParamsMap, ComputationParamTemplate } from "../../ui/components/common/OptionParams";
export const templateComputationParams: ComputationParamTemplate[] = [
  {
    opt: "out",
    name: "output directory",
    type: "DIR_PATH",
    description: "directory for produced output",
    default: "results"
  },
  {
    opt: "max",
    name: "max iterations",
    type: "INT",
    description: "max iterations for iterative algorithms",
    default: 200
  },
  {
    opt: "pr",
    name: "precision",
    type: "INT",
    description: "decimal precision (number of significant decimal digits)",
    default: 10
  },
  {
    opt: "solveIO",
    name: "should solve internal orientation",
    type: "BOOL",
    description: "considers internal orientation parameters as unknowns (pseudo-observation equations are added to the system)",
    default: true,
    additionalParamsIfEnabled: [
      {
        opt: "pow",
        name: "pseudo observations weight",
        type: "DECIMAL",
        description: "sets the weight for pseudo-observation equations (only applies if solveIO is selected)",
        default: 1
      }
    ]
  },
  {
    opt: "cw",
    name: "constraints weight",
    type: "DECIMAL",
    description: "sets the weight for constraint equations",
    default: 1
  },
  {
    opt: "opt",
    name: "optimized",
    type: "BOOL",
    description: "optimize bundle block adjustment by reducing number of considered tie points and solving remaining tie points separately",
    default: true,
    additionalParamsIfEnabled: [
      {
        opt: "block",
        name: "max tie points block",
        type: "INT",
        description: "max block size for tie points (only applies if optimized is selected)",
        default: 100
      },
    ]
  },
  {
    opt: "tpd",
    name: "tie points detection",
    type: "BOOL",
    description: "uses OpenCV library to detect tie points through features matching",
    default: false,
    additionalParamsIfEnabled: [
      {
        opt: "nf",
        name: "number of features",
        type: "INT",
        description: "maximum number of features to detect in features detection (only applies if tpd is selected)",
        default: 1000
      },
      {
        opt: "scale",
        name: "scale factor",
        type: "DECIMAL",
        description: "scale factor for resizing in features detection (only applies if tpd is selected)",
        default: 10
      },
      {
        opt: "ratio",
        name: "ratio threshold",
        type: "DECIMAL",
        description: "ratio threshold for filtering in features matching (only applies if tpd is selected)",
        default: 1000
      },
    ]
  },
  {
    opt: "d",
    name: "distortion",
    enumValues: ["BROWN", "NONE"],
    type: "ENUM",
    description: "distortion model to use",
    default: "NONE"
  },
  {
    opt: "ic",
    name: "input convention",
    enumValues: ["YPR", "OPK"],
    type: "ENUM",
    description: "input angles convention",
    default: "YPR"
  },
  {
    opt: "oc",
    name: "output convention",
    enumValues: ["YPR", "OPK"],
    type: "ENUM",
    description: "output angles convention",
    default: "OPK"
  },
  {
    opt: "iu",
    name: "input unit",
    enumValues: ["DEG", "RAD"],
    type: "ENUM",
    description: "input angles unit",
    default: "DEG"
  },
  {
    opt: "ou",
    name: "output unit",
    enumValues: ["DEG", "RAD"],
    type: "ENUM",
    description: "output angles unit",
    default: "RAD"
  }
]

export const templateInputComputationParams: ComputationParamTemplate[] = [
  {
    opt: 'gcpS',
    name: 'gcpSpaceCoordinates',
    type: "FILE_PATH"
  },
  {
    opt: 'gcpI',
    name: 'gcpImageCoordinates',
    type: "FILE_PATH"
  },
  {
    opt: 'tpI',
    name: 'tpImageCoordinates',
    type: "FILE_PATH"
  },
  {
    opt: 'imgs',
    name: 'imagesOrientation',
    type: "FILE_PATH"
  },
  {
    opt: 'cams',
    name: 'camerasParameters',
    type: "FILE_PATH"
  }
];

export function stringifyCmdParams(params: ComputationParamsMap, template: ComputationParamTemplate[]): string[] {
  return template
    .reduce((acc, tempParam) => {
      if (tempParam.type === "BOOL") {
        if (params[tempParam.opt]) {
          if('additionalParamsIfEnabled' in tempParam)
            return [...acc, `-${tempParam.opt}`, ...stringifyCmdParams(params, tempParam.additionalParamsIfEnabled)];
          else
            return [...acc, `-${tempParam.opt}`];
        } else {
          return acc;
        }
      }
      return [...acc, `-${tempParam.opt}`, params[tempParam.opt].toString()];
    }, [] as string[]);
}
