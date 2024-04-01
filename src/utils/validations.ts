import { FormEvent } from "react";

export function isTelephone(str: string): boolean {
  return /^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(
    str
  );
}

export function isFax(str: string): boolean {
  return isTelephone(str);
}

export function isEmail(str: string): boolean {
  return /^((\w[^\W]+)[.-]?){1,}@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    str
  );
}

// karena format baru NPWP akan diimplementasikan pada 1 Juli 2024, maka function ini nggak akan bertahan lama
export function isValidNPWP(str: string): boolean {
  const jenis = str.substring(0, 2);
  if (str.at(2) !== ".") return false;
  const nomorUrut1 = str.substring(3, 6);
  if (str.at(6) !== ".") return false;
  const nomorUrut2 = str.substring(7, 10);
  if (str.at(10) !== "-") return false;
  const kodeCekDigit = str.at(11);
  if (str.at(12) !== ".") return false;
  const kodeKPP = str.substring(13, 16);
  if (str.at(16) !== ".") return false;
  const status = str.at(17);

  console.log(jenis, nomorUrut1, nomorUrut2, kodeCekDigit, kodeKPP, status);

  if (isNaN(Number(jenis))) return false;
  if (isNaN(Number(nomorUrut1))) return false;
  if (isNaN(Number(nomorUrut2))) return false;
  if (isNaN(Number(kodeCekDigit))) return false;
  if (isNaN(Number(kodeKPP))) return false;
  if (isNaN(Number(status))) return false;

  return true;
}

export function autoCap(e: FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.toUpperCase();
}

export function onlyNumber(e: FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9-]/, "");
}

export function onlyNPWP(e: FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9-.]/, "");
}
