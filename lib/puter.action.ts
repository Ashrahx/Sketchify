import puter from "@heyputer/puter.js";
import {
  getOrCreateHostingConfig,
  uploadImageToHosting,
} from "./puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch {
    return null;
  }
};

// Ensure PUTER_WORKER_URL is configured
const validateWorkerUrl = (): void => {
  if (!PUTER_WORKER_URL || PUTER_WORKER_URL.trim() === "") {
    throw new Error(
      "PUTER_WORKER_URL is not configured. Please set the VITE_PUTER_WORKER_URL environment variable.",
    );
  }
};

export const createProject = async ({
  item,
  visibility = "private",
}: CreateProjectParams): Promise<DesignItem | null | undefined> => {
  try {
    const projectId = item.id;

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId
      ? await uploadImageToHosting({
          hosting,
          url: item.sourceImage,
          projectId,
          label: "source",
        })
      : null;

    const hostedRender =
      projectId && item.renderedImage
        ? await uploadImageToHosting({
            hosting,
            url: item.renderedImage,
            projectId,
            label: "rendered",
          })
        : null;

    const resolvedSource =
      hostedSource?.url ||
      (isHostedUrl(item.sourceImage) ? item.sourceImage : "");

    if (!resolvedSource) {
      throw new Error("Failed to host source image");
    }

    const resolvedRender = hostedRender?.url
      ? hostedRender?.url
      : item.renderedImage && isHostedUrl(item.renderedImage)
        ? item.renderedImage
        : undefined;

    // Get current user for owner info
    const currentUser = await getCurrentUser();

    const {
      sourcePath: _sourcePath,
      renderedPath: _renderedPath,
      publicPath: _publicPath,
      ...rest
    } = item;

    const payload: DesignItem = {
      ...rest,
      sourceImage: resolvedSource,
      renderedImage: resolvedRender,
      ownerId: currentUser?.uuid || null,
      ownerName: currentUser?.username || null,
      isPublic: visibility === "public",
    };

    // Store project in Puter KV Storage (native, secure, no CORS issues)
    await puter.kv.set(`project:${projectId}`, JSON.stringify(payload));

    // Also store project ID in user's project list for listing
    const projectsList = await puter.kv.get(`projects:list`);
    const list = projectsList ? JSON.parse(projectsList) : [];
    if (!list.includes(projectId)) {
      list.push(projectId);
      await puter.kv.set(`projects:list`, JSON.stringify(list));
    }

    return payload;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create project:", errorMessage);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    // Retrieve project IDs from Puter KV Storage
    const projectsList = await puter.kv.get(`projects:list`);
    const projectIds = projectsList ? JSON.parse(projectsList) : [];

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return [];
    }

    // Fetch all projects in parallel
    const projects = await Promise.all(
      projectIds.map(async (id: string) => {
        try {
          const projectData = await puter.kv.get(`project:${id}`);
          return projectData ? JSON.parse(projectData) : null;
        } catch {
          return null;
        }
      }),
    );

    // Filter out null values and get current user info
    const validProjects = projects.filter((p): p is DesignItem => p !== null);
    const currentUser = await getCurrentUser();

    // Ensure all projects have owner info
    const result = validProjects.map((project) => ({
      ...project,
      ownerId: project.ownerId || currentUser?.uuid || null,
      ownerName: project.ownerName || currentUser?.username || "Unknown",
    }));

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get projects:", errorMessage);
    return [];
  }
};

export const getProjectById = async ({ id }: { id: string }) => {
  try {
    if (!id) {
      throw new Error("Project ID is required");
    }

    // Retrieve project from Puter KV Storage
    const projectData = await puter.kv.get(`project:${id}`);

    if (!projectData) {
      return null;
    }

    const project: DesignItem = JSON.parse(projectData);

    // Get current user to fill in missing owner info
    const currentUser = await getCurrentUser();

    // Ensure project has owner info
    return {
      ...project,
      ownerId: project.ownerId || currentUser?.uuid || null,
      ownerName: project.ownerName || currentUser?.username || "Unknown",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch project:", errorMessage);
    return null;
  }
};

export const deleteProject = async ({ id }: { id: string }) => {
  try {
    if (!id) {
      throw new Error("Project ID is required");
    }

    // Delete project from Puter KV Storage
    await puter.kv.del(`project:${id}`);

    // Remove ID from project list
    const projectsList = await puter.kv.get(`projects:list`);
    const list = projectsList ? JSON.parse(projectsList) : [];
    const updatedList = list.filter((projectId: string) => projectId !== id);
    await puter.kv.set(`projects:list`, JSON.stringify(updatedList));

    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to delete project:", errorMessage);
    throw error;
  }
};
