import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { FileFormat } from "../enums/file.enum";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useConfig from "./useConfig";
import useJson from "./useJson";

const defaultJson = JSON.stringify(
  {
    fruits: [
      {
        name: "Apple",
        color: "Red",
        nutrients: {
          calories: 52,
          fiber: "2.4g",
          vitaminC: "4.6mg",
        },
      },
      {
        name: "Banana",
        color: "Yellow",
        nutrients: {
          calories: 89,
          fiber: "2.6g",
          potassium: "358mg",
        },
      },
      {
        name: "Orange",
        color: "Orange",
        nutrients: {
          calories: 47,
          fiber: "2.4g",
          vitaminC: "53.2mg",
        },
      },
    ],
  },
  null,
  2
);

type SetContents = {
  contents?: string;
  hasChanges?: boolean;
  skipUpdate?: boolean;
  format?: FileFormat;
};

interface JsonActions {
  getContents: () => string;
  getFormat: () => FileFormat;
  getHasChanges: () => boolean;
  setError: (error: string | null) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setContents: (data: SetContents) => void;
  setFormat: (format: FileFormat) => void;
  clear: () => void;
  checkEditorSession: () => void;
}

const initialStates = {
  format: FileFormat.JSON,
  contents: defaultJson,
  error: null as any,
  hasChanges: false,
};

export type FileStates = typeof initialStates;

const debouncedUpdateJson = debounce((value: unknown) => {
  useGraph.getState().setLoading(true);
  useJson.getState().setJson(JSON.stringify(value, null, 2));
}, 800);

const useFile = create<FileStates & JsonActions>()((set, get) => ({
  ...initialStates,
  clear: () => {
    set({ contents: "" });
    useJson.getState().clear();
  },
  getContents: () => get().contents,
  getFormat: () => get().format,
  getHasChanges: () => get().hasChanges,
  setFormat: format => set({ format }),
  setContents: async ({ contents, hasChanges = true, skipUpdate = false, format }) => {
    try {
      set({
        ...(contents && { contents }),
        error: null,
        hasChanges,
        format: format ?? get().format,
      });

      if (!useConfig.getState().liveTransformEnabled && skipUpdate) return;

      if (get().hasChanges && contents && contents.length < 80_000) {
        sessionStorage.setItem("content", contents);
        sessionStorage.setItem("format", get().format);
        set({ hasChanges: true });
      }

      try {
        const json = JSON.parse(get().contents);
        debouncedUpdateJson(json);
      } catch (error: any) {
        if (error?.message) set({ error: error.message });
        useJson.setState({ loading: false });
        useGraph.setState({ loading: false });
      }
    } catch (error: any) {
      if (error?.message) set({ error: error.message });
      useJson.setState({ loading: false });
      useGraph.setState({ loading: false });
    }
  },
  setError: error => set({ error }),
  setHasChanges: hasChanges => set({ hasChanges }),
  checkEditorSession: () => {
    let contents = defaultJson;
    const sessionContent = sessionStorage.getItem("content") as string | null;
    const format = sessionStorage.getItem("format") as FileFormat | null;
    if (sessionContent) contents = sessionContent;

    if (format) set({ format });
    get().setContents({ contents, hasChanges: false });
  },
}));

export default useFile;