import { Homework } from "@/types";
// import { formatDate } from "@/utils/dateTime";

export async function createHomework(
  homework: Omit<Homework, "id">,
): Promise<Homework> {
  // const response = await api.post("/homework", homework);
  // return response.data;
  return {} as Homework;
}

export async function updateHomework(
  id: string,
  homework: Partial<Homework>,
): Promise<Homework> {
  // const response = await api.put(`/homework/${id}`, homework);
  // return response.data;
  return {} as Homework;
}

export async function deleteHomework(id: string): Promise<void> {
  // await api.delete(`/homework/${id}`);
}

export async function getHomeworkList(
  classId: string,
  startDate: Date,
  endDate: Date,
): Promise<Homework[]> {
  // const response = await api.get("/homework", {
  //   params: {
  //     classId,
  //     startDate: formatDate(startDate),
  //     endDate: formatDate(endDate),
  //   },
  // });
  // return response.data;
  return [];
}
