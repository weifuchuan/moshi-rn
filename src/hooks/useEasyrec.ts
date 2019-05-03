import { IAccount } from "@/models/Account";
import { useEffect } from "react";
import { EasyrecAPI } from "@/kit/easyrec";
import { useStore } from "@/store";

export function useEasyrecView(refId: number, refType: "article" | "course") {
  const { me } = useStore();
  useEffect(() => {
    EasyrecAPI.view({
      itemid: "" + refId,
      itemdescription: "" + refId,
      itemurl: refType + "/" + refId,
      itemtype: refType.toUpperCase(),
      ...(me ? { userid: me.id.toString() } : {})
    });
  }, [refId, refType]);
}

export function useEasyrecBuy(refId: number, refType: "course") {
  const { me } = useStore();
  useEffect(() => {
    EasyrecAPI.buy({
      itemid: "" + refId,
      itemdescription: "" + refId,
      itemurl: refType + "/" + refId,
      itemtype: refType.toUpperCase(),
      ...(me ? { userid: me.id.toString() } : {})
    });
  }, [refId, refType]);
}

// export function useEasyrecTrack(refId: number, refType: "course") {
//   const { me } = useStore();
//   useEffect(() => {
//     EasyrecAPI.track({
//       itemtoid: "" + refId,
//       itemtotype: refType,
//       ...(me ? { userid: me.id.toString() } : {})
//     });
//   }, [refId, refType]);
// }
