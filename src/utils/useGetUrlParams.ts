import useMultiMatch from './useMultiMatch';

export default function useGetUrlParams() {
  const m = useMultiMatch(
    '/editor/:imgId/:pointType/:pointId',
    '/editor/:imgId/:pointType/',
    '/editor/:imgId/'
  );
  // eslint-disable-next-line
  return (m?.params)!;
}