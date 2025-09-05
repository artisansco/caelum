import type { PageServerLoad } from "./$types";
import { get_staff_by_id } from "../staff.remote";

export const load:PageServerLoad = async ({ params,}) => {
  const staff = await get_staff_by_id(params.staff_id)

return {staff}
}
