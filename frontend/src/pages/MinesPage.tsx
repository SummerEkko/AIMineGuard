import React, { useState } from "react";
import { useMines } from "../hooks/useMines";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Mine, CreateMineRequest, UpdateMineRequest } from "../types";

export const MinesPage: React.FC = () => {
  const { mines, loading, error, createMine, updateMine, deleteMine } =
    useMines();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMine, setEditingMine] = useState<Mine | null>(null);
  const [formData, setFormData] = useState<CreateMineRequest>({
    name: "",
    location: "",
    description: "",
    capacity: 0,
    status: "active",
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMine(formData);
      setShowCreateForm(false);
      setFormData({
        name: "",
        location: "",
        description: "",
        capacity: 0,
        status: "active",
      });
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMine) return;

    try {
      await updateMine(editingMine.id, formData as UpdateMineRequest);
      setEditingMine(null);
      setFormData({
        name: "",
        location: "",
        description: "",
        capacity: 0,
        status: "active",
      });
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("确定要删除这个矿山吗？")) {
      try {
        await deleteMine(id);
      } catch (err) {
        // 错误已在hook中处理
      }
    }
  };

  const startEdit = (mine: Mine) => {
    setEditingMine(mine);
    setFormData({
      name: mine.name,
      location: mine.location,
      description: mine.description || "",
      capacity: mine.capacity,
      status: mine.status,
    });
  };

  const cancelEdit = () => {
    setEditingMine(null);
    setFormData({
      name: "",
      location: "",
      description: "",
      capacity: 0,
      status: "active",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "活跃";
      case "inactive":
        return "停用";
      case "maintenance":
        return "维护中";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">矿山管理</h1>
            <Button onClick={() => setShowCreateForm(true)}>添加矿山</Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Create/Edit Form */}
          {(showCreateForm || editingMine) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingMine ? "编辑矿山" : "添加新矿山"}</CardTitle>
                <CardDescription>
                  {editingMine ? "修改矿山信息" : "创建新的矿山记录"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={
                    editingMine ? handleUpdateSubmit : handleCreateSubmit
                  }
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="矿山名称"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="请输入矿山名称"
                      required
                    />
                    <Input
                      label="位置"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="请输入矿山位置"
                      required
                    />
                  </div>

                  <Input
                    label="描述"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="请输入矿山描述"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="产能 (吨/年)"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacity: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="请输入年产能"
                      required
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        状态
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as any,
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        <option value="active">活跃</option>
                        <option value="inactive">停用</option>
                        <option value="maintenance">维护中</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" loading={loading}>
                      {editingMine ? "更新" : "创建"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={
                        editingMine
                          ? cancelEdit
                          : () => setShowCreateForm(false)
                      }
                    >
                      取消
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Mines List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">加载中...</div>
            ) : mines.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                暂无矿山数据
              </div>
            ) : (
              mines.map((mine) => (
                <Card key={mine.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{mine.name}</CardTitle>
                        <CardDescription>{mine.location}</CardDescription>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          mine.status
                        )}`}
                      >
                        {getStatusText(mine.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        {mine.description || "暂无描述"}
                      </p>
                      <div className="text-sm">
                        <span className="text-gray-500">年产能:</span>
                        <span className="ml-2 font-medium">
                          {mine.capacity.toLocaleString()} 吨
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">设备数量:</span>
                        <span className="ml-2 font-medium">
                          {mine.equipment_count || 0}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">创建时间:</span>
                        <span className="ml-2">
                          {new Date(mine.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => startEdit(mine)}
                        >
                          编辑
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(mine.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
