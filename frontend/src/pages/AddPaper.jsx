import { useState } from "react";
import api from "../services/baseApi";
import {
  researchDomains,
  readingStages,
  impactScores,
} from "../data/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPaper } from "@/services/paperApi";

function AddPaper() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paperTitle: "",
    firstAuthorName: "",
    researchDomain: "",
    readingStage: "",
    citationCount: "",
    impactScore: "",
    dateAdded: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await createPaper({
        ...formData,
        citationCount: Number(formData.citationCount),
      });
      alert("Paper added successfully!");

      setFormData({
        paperTitle: "",
        firstAuthorName: "",
        researchDomain: "",
        readingStage: "",
        citationCount: "",
        impactScore: "",
        dateAdded: "",
      });
    } catch (error) {
      console.error(error);

      alert("Failed to add paper");
    } finally {
      setLoading(false);
    }
  };
  console.log(formData);
  

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Add Research Paper
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Paper Title */}

            <div className="space-y-2">
              <label className="font-medium">
                Paper Title
              </label>

              <Input
                required
                placeholder="Enter paper title"
                value={formData.paperTitle}
                onChange={(e) =>
                  handleChange(
                    "paperTitle",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Author */}

            <div className="space-y-2">
              <label className="font-medium">
                First Author Name
              </label>

              <Input
                required
                placeholder="Enter author name"
                value={formData.firstAuthorName}
                onChange={(e) =>
                  handleChange(
                    "firstAuthorName",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Domain */}

            <div className="space-y-2">
              <label className="font-medium">
                Research Domain
              </label>

              <Select
                value={formData.researchDomain}
                onValueChange={(value) =>
                  handleChange(
                    "researchDomain",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>

                <SelectContent>
                  {researchDomains.map((domain) => (
                    <SelectItem
                      key={domain}
                      value={domain}
                    >
                      {domain.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reading Stage */}

            <div className="space-y-2">
              <label className="font-medium">
                Reading Stage
              </label>

              <Select
                value={formData.readingStage}
                onValueChange={(value) =>
                  handleChange(
                    "readingStage",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>

                <SelectContent>
                  {readingStages.map((stage) => (
                    <SelectItem
                      key={stage}
                      value={stage}
                    >
                      {stage.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Citation Count */}

            <div className="space-y-2">
              <label className="font-medium">
                Citation Count
              </label>

              <Input
                required
                type="number"
                min="0"
                placeholder="Enter citations"
                value={formData.citationCount}
                onChange={(e) =>
                  handleChange(
                    "citationCount",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Impact Score */}

            <div className="space-y-2">
              <label className="font-medium">
                Impact Score
              </label>

              <Select
                value={formData.impactScore}
                onValueChange={(value) =>
                  handleChange(
                    "impactScore",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>

                <SelectContent>
                  {impactScores.map((impact) => (
                    <SelectItem
                      key={impact}
                      value={impact}
                    >
                      {impact.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}

            <div className="space-y-2">
              <label className="font-medium">
                Date Added
              </label>

              <Input
                type="date"
                value={formData.dateAdded}
                onChange={(e) =>
                  handleChange(
                    "dateAdded",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Submit */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "Adding Paper..."
                : "Add Paper"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddPaper;