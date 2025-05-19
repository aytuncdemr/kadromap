"use client";
import React, {
    useState,
    useRef,
    useEffect,
    FormEvent,
    useContext,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import trLocale from "@fullcalendar/core/locales/tr";
import { Event } from "../../../interfaces/Event";
import Form from "../form/Form";
import { toast } from "react-toastify";
import axios, { isAxiosError } from "axios";
import { AuthContext } from "@/context/AuthContext";
import stringToRGB from "../../../lib/stringToRGB";
import { User } from "../../../interfaces/User";
import convertToISO from "../../../lib/convertToISO";

const Calendar: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const calendarRef = useRef<FullCalendar>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [newEvent, setNewEvent] = useState<Event>({
        title: "",
        content: "",
        date: "",
    });
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        async function getEvents() {
            try {
                const { data } = await axios.get("/api/events", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                setEvents(data);
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || error.message);
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    console.log(error);
                    toast.error("Bir şeyler ters gitti");
                }
            }
        }

        async function getUser() {
            try {
                const { data } = await axios.get("/api/users", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                setUser(data);
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || error.message);
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Bir şeyler ters gitti");
                    console.log(error);
                }
            }
        }

        getUser();
        getEvents();
    }, []);

    async function addEventHandler(e: FormEvent) {
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/events", newEvent, {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`,
                },
            });
            toast.success(data.message);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Bir şeyler ters gitti");
                console.log(error);
            }
        } finally {
            setNewEvent({ title: "", content: "", date: "" });
            closeModal();
        }
    }

    return (
        <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="custom-calendar">
                <FullCalendar
                    ref={calendarRef}
                    locale={trLocale}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: `prev,next${
                            user?.occupation === "Admin" &&
                            user.departmentName === "Yönetim"
                                ? " addEventButton"
                                : ""
                        }`,
                        center: "title",
                        right: "dayGridMonth,timeGridWeek",
                    }}
                    events={events.map((event) => ({
                        ...event,
                        start: convertToISO(event.date),
                    }))}
                    eventContent={renderEventContent}
                    customButtons={{
                        addEventButton: {
                            text: "Event Ekle",
                            click: openModal,
                        },
                    }}
                />
            </div>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <Form
                    onSubmit={addEventHandler}
                    className="flex flex-col px-2 overflow-y-auto custom-scrollbar"
                >
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                            Yeni Event Ekle
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Yeni bir event eklemek için aşağıdaki bilgileri
                            doldurunuz
                        </p>
                    </div>
                    <div className="mt-8">
                        <div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                    Başlık
                                </label>
                                <input
                                    id="event-title"
                                    type="text"
                                    required
                                    value={newEvent.title}
                                    onChange={(e) =>
                                        setNewEvent((prevEvent) => ({
                                            ...prevEvent,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Tarih
                            </label>
                            <div className="relative">
                                <input
                                    value={newEvent.date}
                                    required
                                    onChange={(e) =>
                                        setNewEvent((prevEvent) => ({
                                            ...prevEvent,
                                            date: e.target.value,
                                        }))
                                    }
                                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Açıklama
                            </label>
                            <div className="relative">
                                <input
                                    id="event-content"
                                    type="text"
                                    value={newEvent.content}
                                    required
                                    onChange={(e) =>
                                        setNewEvent((prevEvent) => ({
                                            ...prevEvent,
                                            content: e.target.value,
                                        }))
                                    }
                                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <button
                            onClick={closeModal}
                            type="button"
                            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                        >
                            Kapat
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                        >
                            Eventi Ekle
                        </button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

const renderEventContent = (eventInfo: EventContentArg) => {
    return (
        <>
            <div
                style={{
                    backgroundColor: stringToRGB(
                        eventInfo.event.title + eventInfo.event.start,
                        0.45
                    ),
                }}
                title={eventInfo.event.title}
                onClick={() => toast.info(eventInfo.event.extendedProps.content)}
                className={`event-fc-color cursor-pointer w-full   text-center flex fc-event-main   p-1 rounded-sm`}
            >
                <div  className="fc-event-title dark:!text-white ">
                    {eventInfo.event.title}
                </div>
            </div>
        </>
    );
};

export default Calendar;
