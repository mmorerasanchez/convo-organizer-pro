
import { Knowledge } from "@/lib/types";

export const mapKnowledgeData = (data: any): Knowledge => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    filePath: data.file_path,
    fileType: data.file_type,
    fileSize: data.file_size,
    fileName: data.file_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    projectId: data.project_id
  };
};
