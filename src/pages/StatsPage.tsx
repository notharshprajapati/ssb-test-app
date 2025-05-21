// src/pages/StatsPage.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useImageManager } from "@/hooks/useImageManager";
import { ImageStat, SortCriteria } from "@/types";
import { formatTimestamp } from "@/lib/time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, PlusCircle, MinusCircle, RefreshCw } from "lucide-react";

const sortImages = (
  images: ImageStat[],
  criteria: SortCriteria
): ImageStat[] => {
  const sorted = [...images];
  switch (criteria) {
    case "default": // Lowest count, then oldest lastShown
      return sorted.sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        const la = a.lastShown ?? Number.MIN_SAFE_INTEGER;
        const lb = b.lastShown ?? Number.MIN_SAFE_INTEGER;
        if (la !== lb) return la - lb;
        return a.name.localeCompare(b.name);
      });
    case "newestShown":
      return sorted.sort((a, b) => (b.lastShown ?? 0) - (a.lastShown ?? 0));
    case "oldestShown":
      return sorted.sort(
        (a, b) =>
          (a.lastShown ?? Number.MIN_SAFE_INTEGER) -
          (b.lastShown ?? Number.MIN_SAFE_INTEGER)
      );
    case "highestCount":
      return sorted.sort((a, b) => b.count - a.count);
    case "lowestCount":
      return sorted.sort((a, b) => a.count - b.count);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    images,
    isLoading,
    error,
    adjustCountManually,
    reloadImagesAndStats,
  } = useImageManager();
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("default");

  const sortedImages = useMemo(
    () => sortImages(images, sortCriteria),
    [images, sortCriteria]
  );

  if (isLoading) return <div className="p-4">Loading statistics...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading stats: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate("/")} size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Image Statistics</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reloadImagesAndStats}
            title="Refresh Image List & Stats"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh List
          </Button>
          <Select
            value={sortCriteria}
            onValueChange={(value) => setSortCriteria(value as SortCriteria)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Priority</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="newestShown">Newest Shown</SelectItem>
              <SelectItem value="oldestShown">Oldest Shown</SelectItem>
              <SelectItem value="highestCount">Highest Count</SelectItem>
              <SelectItem value="lowestCount">Lowest Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {images.length === 0 ? (
        <p>No image statistics found. Try starting a test or add images.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Thumbnail</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Shown</TableHead>
              <TableHead className="text-center">Count</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedImages.map((image) => (
              <TableRow key={image.name}>
                <TableCell>
                  <img
                    src={image.path}
                    alt={image.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{image.name}</TableCell>
                <TableCell>{formatTimestamp(image.lastShown)}</TableCell>
                <TableCell className="text-center">{image.count}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustCountManually(image.name, 1)}
                  >
                    <PlusCircle className="h-5 w-5 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => adjustCountManually(image.name, -1)}
                    disabled={image.count === 0}
                  >
                    <MinusCircle className="h-5 w-5 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
