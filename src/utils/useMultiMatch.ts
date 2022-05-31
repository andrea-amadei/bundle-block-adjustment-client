import { PathMatch, useMatch } from "react-router-dom";

type OneOrMore<T> = { 0: T } & Array<T>;

declare type ParamParseFailed = {
  failed: true;
};
declare type ParamParseSegment<Segment extends string> = Segment extends `${infer LeftSegment}/${infer RightSegment}` ? ParamParseSegment<LeftSegment> extends infer LeftResult ? ParamParseSegment<RightSegment> extends infer RightResult ? LeftResult extends string ? RightResult extends string ? LeftResult | RightResult : LeftResult : RightResult extends string ? RightResult : ParamParseFailed : ParamParseFailed : ParamParseSegment<RightSegment> extends infer RightResult ? RightResult extends string ? RightResult : ParamParseFailed : ParamParseFailed : Segment extends `:${infer Remaining}` ? Remaining : ParamParseFailed;
declare type ParamParseKey<Segment extends string> = ParamParseSegment<Segment> extends string ? ParamParseSegment<Segment> : string;

/**
 * Returns path matches for the FIRST matching URL
 */
export default function useMultiMatch<
  ParamKey extends ParamParseKey<T>,
  T extends string
>(...patterns: OneOrMore<T>): PathMatch<ParamKey> | null {
  let matchFound = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const pattern of patterns) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res = useMatch(pattern);
    if (!matchFound && res) matchFound = res;
  }
  // @ts-ignore
  return matchFound;
}


