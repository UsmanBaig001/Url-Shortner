import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {UrlState} from '@/types/types'
const initialState: UrlState = {
  urls: [],
  trialUrls: [],
  loading: false,
  error: null,
  shortenedUrl: null,
  isSlugAvailable: null,
};

export const shortenUrl = createAsyncThunk(
  "urls/shortenUrl",
  async (
    { originalUrl, customSlug }: { originalUrl: string; customSlug?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, customSlug }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }
      return { shortUrl: data.shortUrl, url: data.url };
    } catch (_error) {
      return rejectWithValue(_error || "Something went wrong");
    }
  }
);

export const checkSlugAvailability = createAsyncThunk(
  "urls/checkSlugAvailability",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/checkSlug?slug=${slug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Slug check failed");
      }
      return data.isAvailable;
    } catch (_error) {
      return rejectWithValue(_error || "Error checking slug");
    }
  }
);
export const updateUrl = createAsyncThunk(
  "url/updateUrl",
  async (
    {
      id,
      originalUrl,
      isActive,
    }: { id: string; originalUrl: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/updateUrl", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, originalUrl, isActive }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update URL");
      }
      return data;
    } catch (_error) {
      return rejectWithValue(_error || "Network error occurred");
    }
  }
);

export const deleteUrl = createAsyncThunk(
  "url/deleteUrl",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/deleteUrl", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete URL");
      }
      return { id };
    } catch (_error) {
      return rejectWithValue(_error || "Network error occurred");
    }
  }
);

export const fetchTrialUrls = createAsyncThunk(
  "url/fetchTrialUrls",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/trialUrls", { credentials: "include" });
    const data = await response.json();
    if (!response.ok)
      return rejectWithValue(data.error || "Failed to fetch trial URLs");
    return data;
  }
);

export const fetchUrls = createAsyncThunk(
  "url/fetchUrls",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/urls", { credentials: "include" });
    const data = await response.json();
    if (!response.ok)
      return rejectWithValue(data.error || "Failed to fetch URLs");
    return data;
  }
);

export const generateQrCode = createAsyncThunk(
  "url/generateQrCode",
  async (shortCode: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/qr/${shortCode}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.error || "Failed to generate QR code");
      return { shortCode, qrCode: data.qrCode };
    } catch (error) {
      return rejectWithValue(error|| "Something went wrong");
    }
  }
);

const urlSlice = createSlice({
  name: "urlSlice",
  initialState,
  reducers: {
    resetShortenState: (state) => {
      state.shortenedUrl = null;
      state.isSlugAvailable = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(shortenUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.shortenedUrl = null;
      })
      .addCase(shortenUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.shortenedUrl = action.payload.shortUrl;
        if (action.payload.url) {
          const newUrl = action.payload.url;
          if (newUrl.userId) {
            state.urls.push(newUrl);
          } else {
            state.trialUrls.push(newUrl);
          }
        }
      })
      .addCase(shortenUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(checkSlugAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSlugAvailable = null;
      })
      .addCase(checkSlugAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.isSlugAvailable = action.payload;
      })
      .addCase(checkSlugAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isSlugAvailable = false;
      })
      .addCase(fetchTrialUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrialUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.trialUrls = action.payload;
      })
      .addCase(fetchTrialUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUrl.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.urls = state.urls.filter((url) => url.id !== id);
        state.trialUrls = state.trialUrls.filter((url) => url.id !== id);
      })
      .addCase(deleteUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? String(action.payload)
          : "Unknown error occurred";
      })
      .addCase(updateUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUrl.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUrl = action.payload;
        const index = state.urls.findIndex((url) => url.id === updatedUrl.id);
        if (index !== -1) {
          state.urls[index] = updatedUrl;
        }
      })
      .addCase(updateUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateQrCode.fulfilled, (state, action) => {
        const { shortCode, qrCode } = action.payload;
        const urlIndex = state.urls.findIndex(
          (url) => url.shortCode === shortCode
        );
        const trialUrlIndex = state.trialUrls.findIndex(
          (url) => url.shortCode === shortCode
        );
        if (urlIndex !== -1) state.urls[urlIndex].qrCode = qrCode;
        if (trialUrlIndex !== -1)
          state.trialUrls[trialUrlIndex].qrCode = qrCode;
      })
      .addCase(generateQrCode.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetShortenState } = urlSlice.actions;
export default urlSlice.reducer;
