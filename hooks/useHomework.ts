import { useAtom } from "jotai";
import { homeworkListAtom } from "@/store/atoms";
import * as homeworkService from "@/services/homework";
import { Homework } from "@/types";

export function useHomework() {
  const [homeworkList, setHomeworkList] = useAtom(homeworkListAtom);

  const createHomework = async (homework: Omit<Homework, "id">) => {
    const newHomework = await homeworkService.createHomework(homework);
    setHomeworkList((prev) => [...prev, newHomework]);
    return newHomework;
  };

  const updateHomework = async (id: string, homework: Partial<Homework>) => {
    const updatedHomework = await homeworkService.updateHomework(id, homework);
    setHomeworkList((prev) =>
      prev.map((hw) => (hw.id === id ? updatedHomework : hw)),
    );
    return updatedHomework;
  };

  const deleteHomework = async (id: string) => {
    await homeworkService.deleteHomework(id);
    setHomeworkList((prev) => prev.filter((hw) => hw.id !== id));
  };

  const fetchHomeworkList = async (
    classId: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const list = await homeworkService.getHomeworkList(
      classId,
      startDate,
      endDate,
    );
    setHomeworkList(list);
    return list;
  };

  return {
    homeworkList,
    createHomework,
    updateHomework,
    deleteHomework,
    fetchHomeworkList,
  };
}
