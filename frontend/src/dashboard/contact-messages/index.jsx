import React, { useState } from "react";
import debounce from "lodash/debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableLoader,
  TableHeader,
} from "@/ui/table";
import { SearchBox, Title } from "@/dashboard/shared/page-header";
import Alert from "@/ui/alert";
import Paginate from "@/ui/paginate";
import Modal from "@/ui/modal";
import toast from "react-hot-toast";
import { BtnBlue, BtnWhite } from "@/dashboard/shared/btn";
import {
  useContactMessagesQuery,
  useDeleteContactMessageMutation,
  useReplyContactMessageMutation,
} from "@/redux/api/app-api";

const initData = {
  result: [],
  total: 0,
  page: 1,
  limit: 10,
  offset: 0,
  count: 0,
};

const tableHeaders = [
  { id: "name", title: "NAME" },
  { id: "email", title: "EMAIL" },
  { id: "message", title: "MESSAGE" },
  { id: "date", title: "RECEIVED AT" },
  { id: "action", title: "ACTION" },
];

const ContactMessages = () => {
  const [filter, setFilter] = useState({ page: 1, limit: 10, search: "" });
  const [activeMessage, setActiveMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { data = initData, isFetching, isError, error, refetch } =
    useContactMessagesQuery(filter);
  const [replyContactMessage, { isLoading: isReplying }] =
    useReplyContactMessageMutation();
  const [deleteContactMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const handleSearch = debounce((e) => {
    const value = e.target.value;
    setFilter((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  }, 500);

  const openMessage = (message) => {
    setActiveMessage(message);
    setReplyText("");
  };

  const closeMessageModal = () => {
    setActiveMessage(null);
    setReplyText("");
  };

  const sendReply = async () => {
    if (!activeMessage?._id) return;
    if (!replyText.trim() || replyText.trim().length < 3) {
      toast.error("Reply should be at least 3 characters.");
      return;
    }
    try {
      const response = await replyContactMessage({
        id: activeMessage._id,
        reply: replyText.trim(),
      }).unwrap();
      toast.success(response?.message || "Reply sent successfully.");
      closeMessageModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send reply.");
    }
  };

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      const response = await deleteContactMessage(messageId).unwrap();
      toast.success(response?.message || "Message deleted successfully.");
      if (activeMessage?._id === messageId) {
        closeMessageModal();
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete message.");
    }
  };

  return (
    <div>
      <div className="lg:flex items-center justify-between mb-4">
        <Title title="Contact Messages" subTitle="Messages sent by users" />
        <div className="max-w-full">
          <SearchBox onChange={handleSearch} />
        </div>
      </div>

      <Modal
        isOpen={Boolean(activeMessage)}
        toggle={closeMessageModal}
        className="max-w-3xl"
        title="Contact Message"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{activeMessage?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium break-all">{activeMessage?.email || "N/A"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Received Message</p>
            <div className="rounded border bg-gray-50 p-3 whitespace-pre-wrap break-words">
              {activeMessage?.message || "No message"}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Reply</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={6}
              placeholder="Write your reply..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <BtnWhite
              type="button"
              onClick={closeMessageModal}
              disabled={isReplying}
              className="px-4 py-2"
            >
              Cancel
            </BtnWhite>
            <BtnBlue
              type="button"
              onClick={sendReply}
              disabled={isReplying}
              className="px-4 py-2"
            >
              {isReplying ? "Sending..." : "Send Reply"}
            </BtnBlue>
          </div>
        </div>
      </Modal>

      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader cells={tableHeaders} />
          <TableBody>
            {isFetching ? (
              <TableLoader row={10} col={5} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert message={error?.data?.message ?? "something wrong"} />
                </TableCell>
              </TableRow>
            ) : data.result.length ? (
              data.result.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <div className="max-w-md whitespace-pre-wrap break-words">
                      {item.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openMessage(item)}
                        className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        disabled={isDeleting}
                        className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert message="No messages found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Paginate
        data={data}
        onChange={(current) =>
          setFilter((prev) => ({
            ...prev,
            page: current,
          }))
        }
      />
    </div>
  );
};

export default ContactMessages;
