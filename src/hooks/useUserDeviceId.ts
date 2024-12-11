import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
export function useUserDeviceId() {
  const [fpHash, setFpHash] = useState<string | null>(null);

  useEffect(() => {
    getFingerprint();
  });

  return fpHash;
}

export async function getFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}
