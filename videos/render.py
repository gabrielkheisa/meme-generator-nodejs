#!/usr/bin/env python3
from moviepy.editor import *  
import base64
import time
import textwrap
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

bendera = 0

theteks = ""
picture = VideoFileClip("video.mp4")

thesize = 25


def checkindo():
  mycursor = mydb.cursor()
  sql = "SELECT * FROM meme_ronaldo WHERE status = '0' "

  mycursor.execute(sql)

  myresult = mycursor.fetchall()

  if not myresult:
    print("No input video")
    return

  for x in myresult:
    user_empty = x[2]
    text_db = x[1] # Fetch from Teks
    print(text_db)
    if (len(user_empty)) <= 1: 
      print("Ok")
      return
    else:
      print("User " + user_empty + " kosong, rendering " + str(user_empty))

      text_dbd = str(text_db)

      theteks = text_dbd
      tp = theteks.split(",")
      t1 = textwrap.fill(tp[0].upper(), thesize)
      t10 = "10 KETIKA 11"

      texts = [t1,t2,t3,t4,t5,t6,t7,t8,t9]


      step = 3 #each 15 sec: 0, 15, 30
      duration = 3
      t = 0
      txt_clips = []

      starts =    [0,8] # or whatever
      durations = [8,0]

      for text,t,duration in zip(texts, starts, durations): 
         txt_clip = TextClip(text, fontsize = 40, color='white', font="Roboto Mono", stroke_color="black")
         txt_clip = txt_clip.set_start(t)
         txt_clip = txt_clip.set_pos('bottom').set_duration(duration)
         txt_clips.append(txt_clip)

      final_video = CompositeVideoClip([picture,txt_clips[0],txt_clips[1],txt_clips[2],txt_clips[3],txt_clips[4],txt_clips[5],txt_clips[6],txt_clips[7],txt_clips[8]])

      final_video.write_videofile(str(user_empty)+".mp4")

      #with open('teks.txt', "w") as myfile:
      #myfile.write("S0VUSUtBIDEsS0VUSUtBIDIsS0VUSUtBIDMsS0VUSUtBIDQsS0VUSUtBIDUsS0VUSUtBIDYsS0VUSUtBIDcsS0VUSUtBIDgsS0VUSUtBIDks")
        




      sql = "UPDATE meme_ronaldo SET status = \'"+ "1" +"\' WHERE session = \'" + str(user_empty)  +"\'"
      mycursor.execute(sql)
      # myresult = mycursor.fetchall()
      mydb.commit()
      return


while True:
  mydb = mysql.connector.connect(
  host=os.getenv('DB_HOST'),
  user=os.getenv('DB_USER'),
  password=os.getenv('DB_PASSWORD'),
  database=os.getenv('DB_NAME')
  )

  checkindo()  
  time.sleep(1)

# textwrap.fill(tp[0].upper(), thesize)

  


