"use server";
import { cookies } from "next/headers";
import { revalidateTag } from 'next/cache'

export async function setBannerCookie(popUpId: number) {
  const cookiesStore = await cookies();
  const weekInSeconds = 604800;

  const existingCookie = cookiesStore.get('hide-popups');
  const newCookieValue = existingCookie ? existingCookie.value + "|" + popUpId.toString() : popUpId.toString();

  cookiesStore.set('hide-popups', newCookieValue, { maxAge: weekInSeconds })
  revalidateTag("popups");
}
